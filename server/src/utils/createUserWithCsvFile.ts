import * as XLSX from 'xlsx'; // Importer la bibliothèque xlsx
import fs from 'fs';
import csv from 'csv-parser';
import { Student } from '../models';

export const createStudentWithCsvFile = async (filePath: string) => {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
            const last_name = row['nom'];
            const first_name = row['prenom'];

            try {
                
                const existingStudent = await Student.findOne({ last_name, first_name });
                
                if (!existingStudent) {

                    const student = new Student({
                        last_name,
                        first_name,
                    });
                    await student.save();
                    console.log(`Étudiant ajouté : ${first_name} ${last_name}`);
                } else {
                    console.log(`Étudiant déjà existant : ${first_name} ${last_name}`);
                }
            } catch (error) {
                console.error(`Erreur lors de la vérification ou de la création de l'étudiant : ${error}`);
            }
        })
        .on('end', () => {
            console.log('Le fichier CSV a été lu avec succès');
        });
};



export const createStudentWithXlsxFile = async (filePath: string) => {
    // Lire le fichier Excel
    const fileBuffer = fs.readFileSync(filePath);
    
    // Convertir le fichier buffer en un objet de données
    const workbook : XLSX.WorkBook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Sélectionner la première feuille de travail
    const worksheet : XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convertir les données de la feuille en format JSON
    const studentsData :  any[] = XLSX.utils.sheet_to_json(worksheet);

    // Parcourir les données des étudiants
    for (const row  of studentsData) {
        const last_name = row['nom'];
        const first_name = row['prenom'];

        try {
            // Vérifier si l'étudiant existe déjà dans la base de données
            const existingStudent = await Student.findOne({ last_name, first_name });

            if (!existingStudent) {
                // Si l'étudiant n'existe pas, créer un nouvel enregistrement
                const student = new Student({
                    last_name,
                    first_name,
                });

                await student.save(); // Sauvegarder dans la base de données
                console.log(`Étudiant ajouté : ${first_name} ${last_name}`);
            } else {
                console.log(`Étudiant déjà existant : ${first_name} ${last_name}`);
            }
        } catch (error : any) {
            console.error(`Erreur lors de la vérification ou de la création de l'étudiant : ${error}`);
        }
    }

    console.log('Le fichier XLSX a été traité avec succès');
};
