const html = `
  <div>
    <div>hola as  <span>  asd </span>  asda sdassas</div>
  </div>
`
// console.log(html);

const clear = html.replace(/\r?\n|\r/g, '')

console.log(clear);
