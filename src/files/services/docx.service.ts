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
            console.log('element', element)
            if (element['w:t'] === undefined) {
              continue
            }
            //  'w:t', [ { _: '{{FROM}}', '$': { 'xml:space': 'preserve'}, {...}]
            // should be values = [ '{{FROM}}', { 'xml:space': 'preserve' } ]

            const values = element['w:t'].map((value) => value._)
            console.log('values', values)
            if (values.includes(start)) {
              console.log('found start')
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
              console.log('found end')
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
}
