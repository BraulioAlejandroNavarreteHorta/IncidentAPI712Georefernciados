import cron from 'node-cron';
import { IncidentModel } from '../../data/models/incident.model';
import { EmailService } from '../services/email.service';
import { generateIncidentEmailTemplate } from '../templates/email.template';

const emailService = new EmailService();

export const emailJob = () => {
    cron.schedule("*/10 * * * * *", async () => {
        try {
            const incidents = await IncidentModel.find({ isEmailSent: false });
            
            if (!incidents.length) {
                console.log("No hay incidentes pendientes por enviar");
                return;
            }

            console.log(`Procesando ${incidents.length} incidentes`);

            await Promise.all(
                incidents.map(async (incident) => {
                    try {
                        // Generar el cuerpo del email usando la plantilla
                        const htmlBody = generateIncidentEmailTemplate(
                            incident.title,
                            incident.description,
                            incident.lat,
                            incident.lng
                        );

                        // Enviar el correo
                        await emailService.sendEmail({
                            to: "braulioalejandronavarretehorta@gmail.com",
                            subject: `Incidente: ${incident.title}`,
                            htmlBody: htmlBody,
                        });

                        console.log(`Email enviado para el incidente con Id ${incident._id}`);

                        // Actualizar el incidente para marcar que el email ha sido enviado
                        await IncidentModel.findByIdAndUpdate(incident._id, { isEmailSent: true });

                        console.log(`Incidente con Id ${incident._id} actualizado como email enviado`);
                    } catch (error) {
                        console.error(`Error al procesar el incidente con Id ${incident._id}:`, error);
                    }
                })
            );
        } catch (error) {
            console.error("Error durante el envío de correos:", error);
        }
    });
};
