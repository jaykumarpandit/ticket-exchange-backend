import { StationsService } from './stations.service';
export declare class StationsController {
    private stationsService;
    constructor(stationsService: StationsService);
    search(q: string, limit?: string): Promise<{
        code: string;
        name: string;
        city: string;
    }[]>;
}
