import { Injectable } from '@nestjs/common'
import * as AdmZip from 'adm-zip'
import { parseStringPromise, Builder } from 'xml2js'
import * as fs from 'fs/promises'

@Injectable()
export class DocxService {
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

    // Función para buscar índices
    const findIndices = async (
      paragraphs: any[],
    ): Promise<{ fromIndex: number; toIndex: number }> => {
      let fromIndex = -1
      let toIndex = -1

      // Buscar {{FROM}} desde el inicio
      for (let i = 0; i < paragraphs.length; i++) {
        const textElements = paragraphs[i]['w:r']?.map((r) => r['w:t']).flat()
        if (textElements && textElements.includes(start)) {
          fromIndex = i
          break // Terminar la búsqueda una vez encontrado
        }
      }

      // Buscar {{TO}} desde el final
      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const textElements = paragraphs[i]['w:r']?.map((r) => r['w:t']).flat()
        if (textElements && textElements.includes(end)) {
          toIndex = i
          break // Terminar la búsqueda una vez encontrado
        }
      }

      return { fromIndex, toIndex }
    }

    // Función para eliminar headers y footers
    const removeHeadersAndFooters = async (): Promise<void> => {
      const headersAndFooters = relationships.Relationship.Relationship.filter(
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
        relationships.Relationship.Relationship.filter(
          (rel) =>
            ![
              'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header',
              'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
            ].includes(rel.$.Type),
        )
      relationships.Relationship.Relationship = filteredRelationships
    }

    // Ejecutar la búsqueda de índices y la eliminación de headers y footers en paralelo
    const body = parsedXml['w:document']['w:body'][0]
    const paragraphs = body['w:p']
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [indices, _] = await Promise.all([
      findIndices(paragraphs),
      removeHeadersAndFooters(),
    ])

    const { fromIndex, toIndex } = indices

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      // Preservar solo el contenido entre {{FROM}} y {{TO}}
      const preservedContent = paragraphs.slice(fromIndex + 1, toIndex)
      parsedXml['w:document']['w:body'][0]['w:p'] = preservedContent
    }

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
}
