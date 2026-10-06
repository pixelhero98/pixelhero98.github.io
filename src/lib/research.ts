import {getCollection,getEntries,type CollectionEntry} from 'astro:content';
export async function researchItems(){
 const projects=(await getCollection('projects')).sort((a,b)=>a.data.order-b.data.order);
 return Promise.all(projects.map(async project=>({project,publications:await getEntries(project.data.publications)})));
}
export type ResearchItem={project:CollectionEntry<'projects'>;publications:CollectionEntry<'publications'>[]};
export function researchLinks(item:ResearchItem){
 const all=[...(item.publications[0]?.data.links??[]),...item.project.data.links];
 return all.filter((link,index)=>all.findIndex(other=>other.url===link.url)===index);
}
