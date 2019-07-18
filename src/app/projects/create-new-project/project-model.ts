export interface ProjectModel {

    id: number, 
    name: string,
    description: string,
    location: string,
    location_text: string,
    return_on_investment: string,
    start_date: string,
    end_date: string,
    expected_funding: number,
    currency: string,
    min_per_user: number,
    max_per_user: number,
    main_image: string,
    news: [string],
    documents: [string],
    gallery: [string],
    active: boolean,
    wallet_hash: string
}