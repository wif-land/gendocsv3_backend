import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import * as Excel from 'exceljs'
import * as path from 'path'

@Injectable()
export class ExcelService {
  async createExcelReportFromTemplate(
    data: { [key: string]: string }[], // { cedula: string, titulado: string, presidente: string
    templatePath: string,
    replaceValues?: { [key: string]: string },
  ): Promise<string> {
    const workbook = new Excel.Workbook()
    const templateDir = path.resolve(templatePath)
    await workbook.xlsx.readFile(templatePath)

    const worksheet = workbook.getWorksheet('Reporte')

    // Buscar la celda que contiene '#1'
    const cellFound = this.findStartRowAndColumn(worksheet, '#1')
    if (cellFound === null) {
      throw new Error('No se encontró la celda de inicio')
    }
    const { row: startRow, colum: startColumn } = cellFound

    // Reemplazar valores
    if (replaceValues) {
      Object.keys(replaceValues).forEach((key) => {
        this.findCellAndReplaceValue(worksheet, key, replaceValues[key])
      })
    }

    // Insertar datos copiando el estilo de la fila de inicio
    data.forEach((item, index) => {
      Object.keys(item).forEach((key, i) => {
        worksheet.getCell(startRow + index, startColumn + i).value = item[key]
      })

      worksheet.getRow(startRow + index).eachCell((cell) => {
        cell.style = worksheet.getCell(startRow, startColumn).style
        cell.alignment = worksheet.getCell(startRow, startColumn).alignment
      })

      // Ajustar el alto  y ancho de la fila en base a la fila de inicio
      worksheet.getRow(startRow + index).height =
        worksheet.getRow(startRow).height

      worksheet.getRow(startRow + index).outlineLevel =
        worksheet.getRow(startRow).outlineLevel
    })

    await workbook.xlsx.writeFile(templateDir)

    return templateDir
  }

  private async findCellAndReplaceValue(
    worksheet: Excel.Worksheet,
    searchText: string,
    replaceText: string,
  ) {
    const cellFound = this.findStartRowAndColumn(worksheet, searchText)
    if (cellFound === null) {
      return
    }
    const { row, colum } = cellFound
    worksheet.getCell(row, colum).value = worksheet
      .getCell(row, colum)
      .value.toString()
      .replace(searchText, replaceText)
  }

  // Método para encontrar la fila de inicio basada en un valor específico
  private findStartRowAndColumn(
    worksheet: Excel.Worksheet,
    searchText: string,
  ): { row: number; colum: number } {
    let cellFound = null
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i)
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (cell.value.toString().includes(searchText)) {
          cellFound = { row: i, colum: colNumber } // Retorna el número de la fila donde se encuentra '#1'
          return
        }
      })

      if (cellFound !== null) {
        return cellFound
      }
    }
    return null // Retorna null si no se encuentra
  }
}
