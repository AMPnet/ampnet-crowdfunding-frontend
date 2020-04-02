interface SingleOfferModel {

    uuid: string,
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
    gallery: string[],
    documents: string[],
    news: string[],
    active: boolean,
    organization: OrganizationChildModel,
    wallet_hash: string,
    current_funding: number,
    investor_count: number
}

interface OrganizationChildModel {
    id: number,
    name: string,
    created_at: string,
    approved: boolean,
    legal_info: string,
    wallet_hash: string
}
