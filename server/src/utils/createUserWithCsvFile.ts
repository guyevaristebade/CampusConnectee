import fs from 'fs';
import path from 'path';
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
