interface CrudInterface {
	list: (limit: number, page: number) => Promise<any>;
	create: (resource: any) => Promise<any>;
	update?: (id: number, resource: any) => Promise<any>;
	detail: (id: number) => Promise<any>;
	remove: (id: number) => Promise<any>;
	patch?: (id: number, resource: any) => Promise<any>;
}

export default CrudInterface;
