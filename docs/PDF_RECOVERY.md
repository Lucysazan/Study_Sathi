# Readable textbook recovery - 2026-11-20

Incident: sampled actual GETs for original CDC Classes1 English,6 Maths and10 Maths on giwmscdnone.gov.np failed (connection closed). Publisher pages still referenced those URLs. Root file host returned403; no retries against restricted paths or header/proxy bypass used. OriginalCDC elibrary requests also failed. This is provider delivery failure, not a fixable iframe CSS issue.

Recovery: public OLE Nepal E-Pustakalaya Textbooks collection lists full CDC textbooks. Selected86 full books for Classes1-12 with supported subject mappings; source metadata identifies CDC as publisher. Each source record supplies title/publication year/language and a public PDF file. Actual GET checked successful response, application/pdf and %PDF- bytes for EVERY included file (86 unique files). No media copied/rehosted; browser embeds original OLE URLs. Source records and editions remain explicit. This is an independently hosted collection, not a guarantee of identical editions or complete syllabus coverage. Grade11 has3 verified books and Grade12 has1; do not imply complete senior-secondary coverage.

Original137 records remain in school-library.json for legacy route lookup only; discovery/search/counts use school-readable-books.json. Old reader paths display actual same-class/subject alternatives, never substitute an optional/older book invisibly. No verified replacement means no broken iframe. Known failed government admin-pilot source directs to the working Grade9 library. Admin government-source allowlist stays unchanged; separate reader URL guard permits only HTTPS pustakalaya.org/media/uploads/documents/*.pdf without credentials/port/query/hash.

Validation: all86 PDF GET-prefix checks passed during collection.14 focused production-browser desktop/mobile cases pass for every class reader links, legacy alternatives, page persistence, playlist navigation, dependent filters and Quick Learn header recovery. Full Chromium (channel chromium, not headless-shell) actually renders Class6 Maths239-page PDF cover/thumbnails in-site; screenshot .firebase/actual-readable-pdf.png inspected. Headless-shell cannot render nativePDF and initially showed blank despite valid HTTP200; full Chromium resolved the test environment limitation. Real phone native inline support varies; direct open/download stays available.

## Sources

Public catalogue: https://pustakalaya.org/search/ with Textbooks collection filter. No private API/key integration. Individual source/file/edition details follow.

| Class | Subject | Title | Edition | Source |
| --- | --- | --- | --- | --- |
| 1 | english | My English - Grade 1 | 2020 | https://pustakalaya.org/documents/detail/f93bc49a-3b04-4562-99cb-52473cc07017/ |
| 1 | mathematics | My Mathematics Grade 1 | 2080 BS. | https://pustakalaya.org/documents/detail/0b884ef4-c4c8-459e-87c8-a931e0b49a33/ |
| 1 | mathematics | मेरो गणित कक्षा १ | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/f574b863-660e-48a6-ba67-47ca0e07209c/ |
| 1 | nepali | मेरो नेपाली - कक्षा १ | वि. सं. २०७७ | https://pustakalaya.org/documents/detail/b4d3cab6-a8fb-4754-acc7-18e0beaad793/ |
| 1 | our-surroundings | हाम्रो सेरोफेरो - कक्षा १ | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/b2e1f0d2-adc8-4f56-9c5a-8f66ff52fc27/ |
| 1 | social-studies | भोट भाषा सामाजिक अध्ययन तथा सिर्जनात्मक कला कक्षा १ | २०६५ | https://pustakalaya.org/documents/detail/364f83b2-6a7b-4192-ac9f-5b931345fcf9/ |
| 2 | english | My English - Grade 2 | 2078 | https://pustakalaya.org/documents/detail/e5f407d0-2b84-4732-9a82-011039d65f37/ |
| 2 | mathematics | मेरो गणित कक्षा २ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/8dad2576-26c7-4bca-be35-8563348f8eec/ |
| 2 | nepali | मेरो नेपाली - कक्षा २ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/e1b043b3-0a91-4574-a7d3-7e46c686b174/ |
| 2 | our-surroundings | हाम्रो सेरोफेरो - कक्षा २ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/29dae9a9-41d2-48f1-a6e2-7188e6c4f083/ |
| 2 | social-studies | भोट भाषा सामाजिक अध्ययन तथा सिर्जनात्मक कला कक्षा २ | २०६५ | https://pustakalaya.org/documents/detail/ba84338d-6fd5-4a1e-9f50-7113ae9be96f/ |
| 3 | english | My English - Grade 3 | 2078 B.S | https://pustakalaya.org/documents/detail/722ab8ca-d29d-4572-9d0f-936b727cb3e4/ |
| 3 | mathematics | My Mathematics Grade 3 | 2021 | https://pustakalaya.org/documents/detail/6e0a347a-0443-480c-b14a-c101a9e8fc38/ |
| 3 | mathematics | मेरो गणित कक्षा ३ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/6bb4c228-70e7-4e6b-81d6-33698b392217/ |
| 3 | nepali | मेरो नेपाली कक्षा ३ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/bb6b2831-4763-45a9-9c3e-7b957710afeb/ |
| 3 | our-surroundings | हाम्रो सेरोफेरो कक्षा ३ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/f9210f37-faf5-4ca9-a732-16a1fdfeca12/ |
| 3 | social-studies | भोट भाषा सामाजिक अध्ययन तथा सिर्जनात्मक कला कक्षा ३ | २०६५ | https://pustakalaya.org/documents/detail/89b922ff-2d1d-4a48-a3bd-c082c09d8259/ |
| 4 | english | English - Grade 4 | 2022 | https://pustakalaya.org/documents/detail/5f02f865-9397-4857-a322-1139805ceb89/ |
| 4 | health | Health, Physical and Creative Arts - Grade 4 | 2022 | https://pustakalaya.org/documents/detail/6e3aa79d-3d58-4cac-a882-b600e25166de/ |
| 4 | health | स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा ४ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/1785aa01-e3c5-46ed-96f8-4698d4f400c9/ |
| 4 | mathematics | Mathematics Grade 4 | 2022 | https://pustakalaya.org/documents/detail/50e60904-b90a-41eb-89d6-0bef90b79757/ |
| 4 | mathematics | गणित कक्षा ४ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/1ad6dfbf-7d90-46f0-96c4-8a9e9355ae66/ |
| 4 | nepali | नेपाली कक्षा ४ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/bd96f677-d357-4ad9-b65f-f48a180869cc/ |
| 4 | science | Science and Technology Grade 4 | 2022 | https://pustakalaya.org/documents/detail/675b476d-f23e-4443-9000-0c45cd3a9461/ |
| 4 | science | विज्ञान तथा प्रविधि कक्षा ४ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/1518dec1-87bf-474b-be0a-376937052779/ |
| 4 | social-studies | सामाजिक अध्ययन तथा मानव मूल्य शिक्षा कक्षा ४ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/72174ef8-f2aa-46ba-af23-8396ddc6a29a/ |
| 4 | social-studies | भोट भाषा सामाजिक अध्ययन तथा सिर्जनात्मक कला कक्षा ४ | २०६५ | https://pustakalaya.org/documents/detail/0bdb0186-24fa-4157-a85b-6e1dbadf5c30/ |
| 5 | english | English - Grade 5 | 2023 | https://pustakalaya.org/documents/detail/4ea852a8-d9cf-4037-9fa4-cc0eca595a52/ |
| 5 | health | स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा ५ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/028e8a70-a932-41b7-8e4d-f90d8677f83e/ |
| 5 | mathematics | Mathematics Grade 5 | 2023 | https://pustakalaya.org/documents/detail/89fbda0a-cd93-41ee-9e3b-beea68b40d15/ |
| 5 | mathematics | गणित कक्षा ५ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/ce02150a-b592-4a14-b122-ecefea2ac5c8/ |
| 5 | nepali | नेपाली कक्षा ५ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/389cdeb9-07ba-42f0-9f82-f22dfc433b2f/ |
| 5 | science | Science and Technology Grade 5 | 2023 | https://pustakalaya.org/documents/detail/3831402c-5ca0-4ed2-932f-7bbcae58c542/ |
| 5 | science | विज्ञान तथा प्रविधि कक्षा ५ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/f5ab24ba-2fc2-434f-81e5-cfc53fa1da35/ |
| 5 | social-studies | सामाजिक अध्ययन तथा मानव मूल्य शिक्षा कक्षा ५ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/0b76fab6-3c29-49c1-8b91-2361b549f65e/ |
| 5 | social-studies | भोट भाषा सामाजिक अध्ययन तथा सिर्जनात्मक कला कक्षा ५ | २०६५ | https://pustakalaya.org/documents/detail/ba03a974-a0bf-41bf-bb77-701d362f5cce/ |
| 6 | english | English - Grade 6 | 2078 B.S. | https://pustakalaya.org/documents/detail/e88b7cbe-0f19-4f6a-bdd3-22f8fd34985d/ |
| 6 | health | स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला - कक्षा ६ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/647dd01f-93cf-4593-a580-0fbf30933f09/ |
| 6 | mathematics | गणित कक्षा ६ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/3fd7538c-e14f-41e9-88fb-591b055b9ad1/ |
| 6 | nepali | नेपाली कक्षा ६ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/098ae88f-b976-4a62-8890-17278a52a26e/ |
| 6 | science | विज्ञान तथा प्रविधि कक्षा ६ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/c1774152-af42-49ca-ab03-a76dc3740254/ |
| 6 | social-studies | सामाजिक अध्ययन तथा मानव मूल्य शिक्षा कक्षा ६ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/a6bba39b-628c-4884-97fe-aa95675cd87f/ |
| 7 | english | English - Grade 7 | 2022 | https://pustakalaya.org/documents/detail/6029aa67-3259-4cfb-ad3c-b0349788e9e2/ |
| 7 | health | स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला - कक्षा ७ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/b2f0145f-a5fd-479c-a40a-b95b882f2e04/ |
| 7 | mathematics | गणित - कक्षा ७ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/8b302f91-04e1-4138-a4eb-7c23dcdd6d8b/ |
| 7 | nepali | नेपाली कक्षा ७ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/e083fe55-233a-49d0-9bb0-c93177ecae90/ |
| 7 | science | विज्ञान तथा प्रविधि कक्षा ७ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/5b83179f-5e21-411c-b4a3-d66f9bcf8560/ |
| 7 | social-studies | सामाजिक अध्ययन तथा मानव मूल्य शिक्षा कक्षा ७ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/bd1f33f0-1398-488a-a149-a8db0ba66222/ |
| 8 | english | English Grade 8 | 2023 | https://pustakalaya.org/documents/detail/fd4e99c3-3790-4e72-9926-30cea3939766/ |
| 8 | health | स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला - कक्षा ८ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/d183e32e-5aed-4ce6-8ec0-25b8ff4815a7/ |
| 8 | health | Health, Physical and Creative Arts - Grade 8 | 2023 | https://pustakalaya.org/documents/detail/470001a1-b978-4b93-b3e3-70de5daac565/ |
| 8 | mathematics | Mathematics - Grade 8 | 2023 | https://pustakalaya.org/documents/detail/63c3a737-73dc-47de-a982-bfa637e73a67/ |
| 8 | mathematics | गणित कक्षा ८ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/5a08d918-58b9-488e-b87c-af8d9a900ee0/ |
| 8 | nepali | नेपाली कक्षा ८ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/b9066bf7-e8f3-4698-a65e-cac17b714d99/ |
| 8 | science | विज्ञान तथा प्रविधि कक्षा ८ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/8b748b68-393a-46ae-844b-f1af7a502b3d/ |
| 8 | social-studies | सामाजिक अध्ययन तथा मानव मूल्य शिक्षा कक्षा ८ | वि. सं. २०८० | https://pustakalaya.org/documents/detail/475d260b-8c95-4471-96ee-b87466d964a7/ |
| 9 | computer-science | Computer Science Grade 9 (2081BS) | 2081 BS | https://pustakalaya.org/documents/detail/87a18b20-4853-4912-ad9d-4cc64535f643/ |
| 9 | english | English - Grade 9 | 2022 | https://pustakalaya.org/documents/detail/48f7f5fc-0ae0-42b2-b3a0-777a4801cdff/ |
| 9 | mathematics | Grade 9 Mathematics | 2022 | https://pustakalaya.org/documents/detail/e2c33be8-0ab1-4d14-aec4-def0bce7f5fe/ |
| 9 | mathematics | गणित कक्षा ९ | वि. सं. २०८१ | https://pustakalaya.org/documents/detail/217b1fa6-51b7-44a0-a96d-580add5ff7a1/ |
| 9 | nepali | नेपाली कक्षा ९ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/f4bfd953-f02c-44c3-af14-caf7489fa3f5/ |
| 9 | science | Science and Technology Grade 9 | 2022 | https://pustakalaya.org/documents/detail/449451d1-7da2-46a6-8319-7dfc344f269a/ |
| 9 | science | विज्ञान तथा प्रविधि कक्षा ९ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/915b63b5-6794-4b62-8cc1-f19ad5f0134f/ |
| 9 | social-studies | सामाजिक अध्ययन कक्षा ९ | वि. सं. २०७९ | https://pustakalaya.org/documents/detail/c090e32d-3698-406a-b5c6-1eff0b38c14c/ |
| 10 | civics | नागरिक शास्त्र - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/6aa1aec9-595f-479e-833e-7720c74ea285/ |
| 10 | computer-science | Computer Science - Grade 10 | 2020 | https://pustakalaya.org/documents/detail/259c3e38-24eb-4279-82d3-55eadb725f61/ |
| 10 | computer-science | कम्प्युटर विज्ञान - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/c329ad04-8dbf-4ae0-bec5-1e936d275f04/ |
| 10 | education | शिक्षा - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/92e5b84a-c573-475e-8815-ebfac9902929/ |
| 10 | english | English - Grade 10 | 2023 | https://pustakalaya.org/documents/detail/904c877e-9bbe-49dd-b257-ab0bab0b6737/ |
| 10 | environment | वातावरण विज्ञान - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/672ecd84-68fd-4535-afa2-e939927a452d/ |
| 10 | geography | भूगोल - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/e52d92d4-7f4b-4277-acd6-c8c23c3fc98c/ |
| 10 | health | स्वास्थ्य तथा शारीरिक शिक्षा - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/76bb3207-f108-40af-ab1c-41c07e357dca/ |
| 10 | history | इतिहास - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/4c1a8504-382e-4468-86d3-54eb544cc366/ |
| 10 | mathematics | Optional Mathematics, Grade - 10 | 2076 BS | https://pustakalaya.org/documents/detail/8acd9191-8cdb-4a0f-b1db-aa149aeb77a0/ |
| 10 | mathematics | Mathematics - Grade 10 | 2023 | https://pustakalaya.org/documents/detail/049b8c9e-7408-4666-92f1-cdbea0ceb5f3/ |
| 10 | mathematics | ऐच्छिक गणित, कक्षा - १० | वि. सं. २०७५ | https://pustakalaya.org/documents/detail/621687a4-abbb-4f2a-969f-a01bb88c0cee/ |
| 10 | mathematics | गणित - कक्षा १० | वि. सं. २०८१ | https://pustakalaya.org/documents/detail/ebf828ca-9586-4bbc-8f03-3acf0908c76d/ |
| 10 | nepali | नेपाली - कक्षा १० | वि. सं. २०८० | https://pustakalaya.org/documents/detail/19f000e9-1688-4b62-bf7c-2b02e02b58ee/ |
| 10 | population-studies | जनसङ्ख्या शिक्षा - कक्षा १० | वि. सं. २०७६ | https://pustakalaya.org/documents/detail/0938d236-ae95-4e7e-81a8-16b8c95e9150/ |
| 10 | science | Optional Science - Grade 10 | 2017 | https://pustakalaya.org/documents/detail/79abe723-ffcb-4923-8f7a-a6789ea8048a/ |
| 10 | science | विज्ञान तथा प्रविधि - कक्षा १० | वि. सं. २०८० | https://pustakalaya.org/documents/detail/48af725e-1d2f-40c4-9e30-dc0303d56128/ |
| 10 | social-studies | सामाजिक अध्ययन - कक्षा १० | वि. सं. २०८० | https://pustakalaya.org/documents/detail/5fd6816a-8cab-4b06-8535-1caad7966c48/ |
| 11 | english | English - Grade 11 | 2020 | https://pustakalaya.org/documents/detail/540a93cd-53e5-4395-9b1c-c43deca257fc/ |
| 11 | nepali | नेपाली - कक्षा ११ | वि. सं. २०७७ | https://pustakalaya.org/documents/detail/1d0580d8-ad20-4307-8366-219bdfda28c1/ |
| 11 | social-studies | सामाजिक अध्ययन तथा जीवनोपयोगी शिक्षा - कक्षा ११ | वि. सं. २०७७ | https://pustakalaya.org/documents/detail/4ca4a941-f54a-4ab6-b89e-8ba5f00c6e6a/ |
| 12 | social-studies | सामाजिक अध्ययन तथा जीवनोपयोगी शिक्षा - कक्षा १२ | वि. सं. २०७८ | https://pustakalaya.org/documents/detail/e482ce47-ef02-4524-b102-492c97b24baf/ |
