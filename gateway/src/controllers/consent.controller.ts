import * as express from 'express'
import { Request, Response } from 'express'
import ControllerBase from '../interfaces/ControllerBase.interface'
import Constants from '../constants/constants';
import { isAuthenticated } from '../middleware/auth'
import Consent from '../services/consent'
const apiPaths: { [index: string]: any } = Constants.CONSENT_MANAGEMENT_API_PATHS;
const path = '/api/consentgateway/v1';

class ConsentController implements ControllerBase {
    public path = path;
    public router: { [index: string]: any } = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.loadRoutes()
    }

    private loadRoutes() {
        Object.values(apiPaths).forEach((route: { method: string, path: string }) => {
            this.router[route.method](`${this.path}${route.path}`, this.forwardToDestination);
        })
    }

    private getDestinationId(headers: any) {
        if (headers['x-hiu-id']) return { destinationId: headers['x-hiu-id'], type: 'hiu' };
        else if (headers['x-hip-id']) return { destinationId: headers['x-hip-id'], type: 'hip' };
        else if (headers['x-cm-id']) return { destinationId: headers['x-cm-id'], type: 'cm' };
        else return null;
    }

    private getPathKey(apiPath: string) {        
        const testString = apiPath.replace(path, '');
        const match = Object.keys(apiPaths).find((key: string) => apiPaths[key].path === testString)
        return match;
    }

    private forwardToDestination = async (req: Request, res: Response) => {
        try {
            await new Consent().handle({
                path: this.getPathKey(req.path),
                payload: req.body,
                ...this.getDestinationId(req.headers),
                client: req.headers['authenticated-client']
            })
            res.send({ status: true }).status(200)
        } catch (error) {
            res.status(error.code || 500).send(error.message || 'Internal Server Error');
        }
    }
}

export default ConsentController
