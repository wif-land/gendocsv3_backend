import { Injectable } from '@nestjs/common'
import * as AdmZip from 'adm-zip'
import { parseStringPromise, Builder } from 'xml2js'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class DocxService {
  private RELS_ZIP_PATH = 'word/_rels/document.xml.rels'
  private DOC_ZIP_PATH = 'word/document.xml'
  private CONTENT_TYPES_PATH = '[Content_Types].xml'
  private ALT_CHUNK_TYPE =
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk'
  private ALT_CHUNK_CONTENT_TYPE =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'

  async mergeDocuments(
    docxFilesArray: string[],
    outDocxFilePath: string,
  ): Promise<number> {
    if (docxFilesArray.length === 0) {
      // No files to merge
      return -1
    }

    if (!outDocxFilePath.endsWith('.docx')) {
      // eslint-disable-next-line no-param-reassign
      outDocxFilePath += '.docx'
    }

    // Copy the first file as the base
    // eslint-disable-next-line prettier/prettier
    if (!await this.copyFile(docxFilesArray[0], outDocxFilePath)) {
      // Cannot create file
      // eslint-disable-next-line no-magic-numbers
      return -2
    }

    const docx = new Docx(outDocxFilePath)

    for (let i = 1; i < docxFilesArray.length; i++) {
      await docx.addFile(docxFilesArray[i], `part${i}.docx`, `rId10${i}`)
    }

    await docx.flush()
    return 0
  }

  private async copyFile(src: string, dest: string): Promise<boolean> {
    try {
      await fs.copyFile(src, dest)
      return true
    } catch (error) {
      console.error('Error copying file:', error)
      return false
    }
  }

  async filterDocx(
    filePath: string,
    start: string,
    end: string,
  ): Promise<string> {
    // Leer el archivo DOCX como un buffer
    const zipBuffer = await fs.readFile(filePath)

    // Cargar el buffer como un archivo zip
    const zip = new AdmZip(zipBuffer)

    // Leer el archivo document.xml
    const documentXml = zip.readAsText('word/document.xml')
    const relationshipsXml = zip.readAsText('word/_rels/document.xml.rels')

    // Parsear el contenido XML y relaciones en paralelo
    const [parsedXml, relationships] = await Promise.all([
      parseStringPromise(documentXml),
      parseStringPromise(relationshipsXml),
    ])

    const body = parsedXml['w:document']['w:body'][0]

    // Función para buscar índices
    const findIndices = (
      paragraphs: any[],
    ): { fromIndex: number; toIndex: number } => {
      let fromIndex = -1
      let toIndex = -1

      // Buscar {{FROM}} desde el inicio
      for (let i = 0; i < paragraphs.length; i++) {
        const textContent = paragraphs[i]?.['w:r']

        if (textContent && Array.isArray(textContent)) {
          for (const element of textContent) {
            if (element['w:t'] === undefined) {
              continue
            }
            const values = element['w:t'].map((value) => value._)
            if (values.includes(start)) {
              fromIndex = i
              break
            }

            if (values.includes(end)) {
              break
            }
          }
        }
        if (fromIndex !== -1) {
          break
        }
      }

      // Buscar {{TO}} desde el final
      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const textContent = paragraphs[i]?.['w:r']

        if (textContent && Array.isArray(textContent)) {
          for (const element of textContent) {
            if (element['w:t'] === undefined) {
              continue
            }

            const values = element['w:t'].map((value) => value._)

            if (values.includes(end)) {
              toIndex = i
              break
            }

            if (values.includes(start)) {
              break
            }
          }
        }
        if (toIndex !== -1) {
          break
        }
      }

      return { fromIndex, toIndex }
    }

    // Ejecutar la búsqueda de índices
    const paragraphs = body['w:p']
    const { fromIndex, toIndex } = findIndices(paragraphs)

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      // Preservar solo el contenido entre {{FROM}} y {{TO}}
      const preservedContent = paragraphs.slice(fromIndex + 1, toIndex)
      parsedXml['w:document']['w:body'][0]['w:p'] = preservedContent
    }

    // Eliminar headers y footers
    const headersAndFooters = relationships.Relationships.Relationship.filter(
      (rel) =>
        [
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header',
          'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
        ].includes(rel.$.Type),
    )

    headersAndFooters.forEach((headerFooter) => {
      zip.deleteFile(`word/${headerFooter.$.Target}`)
    })

    const filteredRelationships =
      relationships.Relationships.Relationship.filter(
        (rel) =>
          ![
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header',
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
          ].includes(rel.$.Type),
      )
    relationships.Relationships.Relationship = filteredRelationships

    // Convertir el objeto XML de nuevo a una cadena
    const builder = new Builder()
    const modifiedXml = builder.buildObject(parsedXml)
    const modifiedRelationshipsXml = builder.buildObject(relationships)

    // Escribir el contenido modificado de vuelta en el archivo document.xml
    zip.updateFile('word/document.xml', Buffer.from(modifiedXml))
    zip.updateFile(
      'word/_rels/document.xml.rels',
      Buffer.from(modifiedRelationshipsXml),
    )

    // Guardar el archivo DOCX modificado en el mismo lugar
    await fs.writeFile(filePath, zip.toBuffer())

    return filePath
  }

  // Nueva función para eliminar saltos de página
  async removePageBreaks(filePath: string): Promise<string> {
    const zipBuffer = await fs.readFile(filePath)
    const zip = new AdmZip(zipBuffer)
    const documentXml = zip.readAsText('word/document.xml')
    const parsedXml = await parseStringPromise(documentXml)

    const body = parsedXml['w:document']['w:body'][0]
    const paragraphs = body['w:p']

    // Eliminar saltos de página
    paragraphs.forEach((paragraph) => {
      const runs = paragraph['w:r']
      if (runs && Array.isArray(runs)) {
        runs.forEach((run) => {
          if (run['w:br'] && run['w:br'][0].$.type === 'page') {
            delete run['w:br']
          }
        })
      }
    })

    const builder = new Builder()
    const modifiedXml = builder.buildObject(parsedXml)

    // Escribir el contenido modificado de vuelta en el archivo document.xml
    zip.updateFile('word/document.xml', Buffer.from(modifiedXml))

    // Guardar el archivo DOCX modificado en el mismo lugar
    await fs.writeFile(filePath, zip.toBuffer())

    return filePath
  }
}

class Docx {
  private docxPath: string
  private docxZip: AdmZip
  private docxRels: any
  private docxDocument: any
  private docxContentTypes: any
  private headerAndFootersArray: Record<string, any> = {}
  private RELS_ZIP_PATH = 'word/_rels/document.xml.rels'
  private DOC_ZIP_PATH = 'word/document.xml'
  private CONTENT_TYPES_PATH = '[Content_Types].xml'
  private ALT_CHUNK_TYPE =
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk'
  private ALT_CHUNK_CONTENT_TYPE =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'

  constructor(docxPath: string) {
    this.docxPath = docxPath
    this.docxZip = new AdmZip(docxPath)
    this.docxRels = this.readContent(this.RELS_ZIP_PATH)
    this.docxDocument = this.readContent(this.DOC_ZIP_PATH)
    this.docxContentTypes = this.readContent(this.CONTENT_TYPES_PATH)
  }

  private readContent(zipPath: string): any {
    const content = this.docxZip.readAsText(zipPath)
    return content
  }

  private writeContent(content: string, zipPath: string): void {
    this.docxZip.updateFile(zipPath, Buffer.from(content))
  }

  async addFile(
    filePath: string,
    zipName: string,
    refID: string,
  ): Promise<void> {
    const content = await fs.readFile(filePath)
    this.docxZip.addFile(zipName, content)

    this.addReference(zipName, refID)
    this.addAltChunk(refID)
    this.addContentType(zipName)
  }

  private addReference(zipName: string, refID: string): void {
    const relXmlString = `<Relationship Target="../${zipName}" Type="${this.ALT_CHUNK_TYPE}" Id="${refID}"/>`
    const pos = this.docxRels.indexOf('</Relationships>')
    this.docxRels =
      this.docxRels.slice(0, pos) + relXmlString + this.docxRels.slice(pos)
  }

  private addAltChunk(refID: string): void {
    const xmlItem = `<w:altChunk r:id="${refID}"/>`
    const pos = this.docxDocument.indexOf('</w:body>')
    this.docxDocument =
      this.docxDocument.slice(0, pos) + xmlItem + this.docxDocument.slice(pos)
  }

  private addContentType(zipName: string): void {
    const xmlItem = `<Override ContentType="${this.ALT_CHUNK_CONTENT_TYPE}" PartName="/${zipName}"/>`
    const pos = this.docxContentTypes.indexOf('</Types>')
    this.docxContentTypes =
      this.docxContentTypes.slice(0, pos) +
      xmlItem +
      this.docxContentTypes.slice(pos)
  }

  async flush(): Promise<void> {
    this.writeContent(this.docxRels, this.RELS_ZIP_PATH)
    this.writeContent(this.docxDocument, this.DOC_ZIP_PATH)
    this.writeContent(this.docxContentTypes, this.CONTENT_TYPES_PATH)

    for (const [path, content] of Object.entries(this.headerAndFootersArray)) {
      this.writeContent(content, path)
    }

    const tempDir = await fs.mkdtemp(path.join('/tmp', 'dm-'))
    const tempFile = path.join(tempDir, 'merged.docx')
    await fs.writeFile(tempFile, this.docxZip.toBuffer())

    await fs.rename(tempFile, this.docxPath)
  }
}
