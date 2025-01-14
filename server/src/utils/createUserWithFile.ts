import * as XLSX from 'xlsx'
import fs from 'fs'
import csv from 'csv-parser'
import { Student } from '../models'

export const createStudentWithCsvFile = async (filePath: string) => {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            const last_name = row['nom']
            const first_name = row['prenom'].chartAt(0).toUpperCase()

            try {
                const existingStudent = await Student.findOne({
                    last_name,
                    first_name,
                })

                if (!existingStudent) {
                    const student = new Student({
                        last_name,
                        first_name,
                    })
                    await student.save()
                    console.log(`Étudiant ajouté : ${first_name} ${last_name}`)
                } else {
                    console.log(
                        `Étudiant déjà existant : ${first_name} ${last_name}`
                    )
                }
            } catch (error) {
                console.error(
                    `Erreur lors de la vérification ou de la création de l'étudiant : ${error}`
                )
            }
        })
        .on('end', () => {
            console.log('Le fichier CSV a été lu avec succès')
        })
}

export const createStudentWithXlsxFile = async (filePath: string) => {
    const fileBuffer: Buffer = fs.readFileSync(filePath)

    // Convert Buffer to Uint8Array
    const arrayBufferView = new Uint8Array(fileBuffer)

    const workbook: XLSX.WorkBook = XLSX.read(arrayBufferView, {
        type: 'array',
    })

    const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]]
    const studentsData: any[] = XLSX.utils.sheet_to_json(worksheet)

    for (const row of studentsData) {
        const last_name = row['NOM']
        const first_name =
            row['PRENOM'].charAt(0).toUpperCase() +
            row['PRENOM'].slice(1).toLowerCase()

        try {
            const existingStudent = await Student.findOne({
                last_name,
                first_name,
            })

            if (!existingStudent) {
                const student = new Student({
                    last_name,
                    first_name,
                })

                await student.save()
                console.log(`Étudiant ajouté : ${first_name} ${last_name}`)
            } else {
                console.log(
                    `Étudiant déjà existant : ${first_name} ${last_name}`
                )
            }
        } catch (error: any) {
            console.error(
                `Erreur lors de la vérification ou de la création de l'étudiant : ${error}`
            )
        }
    }

    console.log('Le fichier XLSX a été traité avec succès')
}
