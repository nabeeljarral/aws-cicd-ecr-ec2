export type IVendor = {
    _id?: string
    name: string
    createdBy?: string
    relatedTo?: string
}

export type IFilterVendorDto = {
    _id?: string
    name?: string
    createdBy?: string
    relatedTo?: string
}