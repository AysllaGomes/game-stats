export class Game {
    id: number;
    totalDeaths: number;
    deathsByCause: { [cause: string]: number };
    deathsByWorld: number;
    events: any[];
}
