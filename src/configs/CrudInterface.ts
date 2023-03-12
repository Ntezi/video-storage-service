interface CrudInterface {
	list: (limit: number, page: number) => Promise<any>;
	create: (resource: any) => Promise<any>;
	update?: (id: string, resource: any) => Promise<any>;
	detail: (id: string) => Promise<any>;
	remove: (id: string) => Promise<any>;
	patch?: (id: string, resource: any) => Promise<any>;
}

export default CrudInterface;
