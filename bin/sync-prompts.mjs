import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const data = {};
for (const [language, filename] of [['en', 'prompts.md'], ['ms', 'prompts-ms.md']]) {
  const source = await readFile(new URL(filename, root), 'utf8');
  data[language] = [...source.matchAll(/^## (\d+)\. (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map((match, index) => {
    const prompt = match[3].match(/```text\n([\s\S]*?)\n```/);
    if (Number(match[1]) !== index + 1 || !prompt) throw new Error(`Invalid prompt ${match[1]} in ${filename}`);
    return { title: match[2], prompt: prompt[1] };
  });
  if (!data[language].length) throw new Error(`No prompts in ${filename}`);
}
if (data.en.length !== data.ms.length) throw new Error('Language prompt counts differ');
const page = new URL('public/index.html', root);
const html = await readFile(page, 'utf8');
const pattern = /(<script id="prompt-data" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!pattern.test(html)) throw new Error('Prompt data element missing');
const json = JSON.stringify(data).replace(/</g, '\\u003c');
await writeFile(page, html.replace(pattern, (_, open, close) => open + json + close));
console.log(`Synced ${data.en.length} prompts per language.`);
