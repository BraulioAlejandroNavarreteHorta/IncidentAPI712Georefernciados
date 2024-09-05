import { Request, Response } from 'express';
import { IncidentModel } from '../../../data/models/incident.model';
import { EmailService } from '../../../domain/services/email.service';

export class IncidentController {

    public getIncidents = async (req: Request, res: Response) => {
        try {
            const incidents = await IncidentModel.find();
            return res.json(incidents);

        } catch (error) {
            return res.status(500).json({ message: "Error al obtener los incidentes" })
        }
    }

    public createIncident = async (req: Request, res: Response) => {
        try {
            const { title, description, lat, lng } = req.body
            const newIncident = await IncidentModel.create({
                title,
                description,
                lat,
                lng
            });
            // const emailService = new EmailService();
            // await emailService.sendEmail({
            //     to:"braulioalejandronavarretehorta@gmail.com",
            //     subject:`Incidente:${newIncident.title}`,
            //     htmlBody:`<h1>${newIncident.description}</h1>`,
            // });
            res.json(newIncident);
        } catch (error) {
            return res.status(500).json({ message: "Error al crear el incidente" })
        }
    }

    public getIncidentById = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const incident = await IncidentModel.findById(id);
            if(!incident){
                return res.status(404).json({message: "Incidente no encontrado"})
            }
            return res.json(incident);

        }catch(error){
            return res.status(500).json({message: "Error al obtener el incidente"})
        }
    }

    public updateIncident = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const { title, description, lat, lng } = req.body;
            await IncidentModel.findByIdAndUpdate(id,
                {
                    title:title, 
                    description:description, 
                    lat:lat, 
                    lng:lng
                });

            const incident = await IncidentModel.findById(id);
            return res.json(incident);

        }catch(error){
            return res.status(500).json({message: "Error al actualizar el incidente"})
        }
    }

    public deleteIncident = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const incident = await IncidentModel.findByIdAndDelete(id);

            if(!incident){
                return res.status(404).json({message: "Incidente no encontrado"})
            }
            return res.json({message: "Incidente eliminado"});

        }catch(error){
            return res.status(500).json({message: "Error al eliminar el incidente"})
        }
    }
}