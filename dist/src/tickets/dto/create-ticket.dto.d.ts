export declare class PassengerDto {
    passengerName: string;
    passengerAge: number;
    passengerGender: string;
    seatNumber?: string;
}
export declare class CreateTicketDto {
    trainNumber: string;
    trainName: string;
    fromStation: string;
    fromStationCode: string;
    toStation: string;
    toStationCode: string;
    journeyDate: string;
    pnr: string;
    travelClass: string;
    quota: string;
    price: number;
    passengers: PassengerDto[];
}
