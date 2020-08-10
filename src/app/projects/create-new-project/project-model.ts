export interface ProjectModel {

    uuid: string;
    name: string;
    description: string;
    location: { lat: string, long: string };
    location_text: string;
    roi: { from: number, to: number };
    start_date: string;
    end_date: string;
    expected_funding: number;
    currency: string;
    min_per_user: number;
    max_per_user: number;
    main_image: string;
    news: string[];
    documents: [string];
    gallery: [string];
    active: boolean;
    wallet_hash: string;
}
