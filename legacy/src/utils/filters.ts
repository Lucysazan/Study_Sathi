import type {Resource} from '../types/resource';
export const categories=['Academic Education','Digital Safety','Financial Literacy','Life Skills','Learning Games','Environment'];
export type Filters={q:string;category:string;age:string;language:string;format:string;purpose:string};
export const emptyFilters:Filters={q:'',category:'',age:'',language:'',format:'',purpose:''};
export function filterResources(resources:Resource[],f:Filters){return resources.filter(r=>{
const [lo,hi]=f.age.split('-').map(Number);
return (!f.q||[r.title,r.topic,r.description,r.provider,r.category,r.language].join(' ').toLowerCase().includes(f.q.toLowerCase()))&&(!f.category||r.category===f.category)&&(!f.age||(r.minAge!==null&&r.maxAge!==null&&r.minAge<=hi&&r.maxAge>=lo))&&(!f.language||(f.language==='Multiple Languages'?r.language==='Multiple Languages'||r.language.includes('/'):r.language.includes(f.language)))&&(!f.format||r.format===f.format)&&(!f.purpose||r.purpose===f.purpose);
});}
