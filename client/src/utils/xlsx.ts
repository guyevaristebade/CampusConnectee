import * as XLSX from 'xlsx'

export const exportToExcel = (data: any[], fileName: string): boolean => {
  let state: boolean = false

  try {
    // Création d'une feuille de calcul à partir des données JSON
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Création d'un classeur et ajout de la feuille de calcul
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille 1')

    // Génération et téléchargement du fichier Excel
    XLSX.writeFile(workbook, `${fileName}${Date.now()}.xlsx`)

    state = true
  } catch (error: any) {
    state = false
  }

  return state
}
