const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const IMAGES = {
  1: "1y67anvfHbkPzTlm0T-QefBYj-H7eDxBh",
  2: "1OfGKgDIHNKIk3xEs628X21uzLLUei7WM",
  3: "1-MPtvszi192Y192qw3iHCS1BdDfMceY1",
  4: "1_H5-V6NBztSTac0p1XxMaUCl9eFYucET",
  6: "1F6wnHTURIH0kuwJY3cxRfEXeex6hYbWi",
  7: "1F_GAjxeGMDbiYMtiIXJ1BVawG-Mgj6ai",
  8: "1uqw-_6PraNrs0LpWBigHYBpRFDn88OZZ",
  9: "1qvINYVlVsIazw08bGMVXeKzKL5LbDMY9",
  10: "1wzkhY1g908aJkCVpG-0Og6YRHSnVAs5s",
  11: "1OhLZW-udZHG-NcBv1J874P5nyYZvUToC",
  12: "1oiL1RMn7XJUQXlTo8-vxVuuJ6ym0WZlR",
  13: "1g5WxmE-6wtLoEjLIM_H16YikVaGEiD3R",
  14: "1MvIut9RJRuk5LLYE32XCzpXaRPBqZdXJ",
  16: "1K8odD0pheTeI9N7wfCjIf6nMMjMxDV8o",
  17: "1Yy05OaCoZRrgTmJeBBOaoFat8JIkFd3P",
  18: "1yrcO7HVWGXnVnROJCGUcFQfAhHMn5EV3",
  19: "1uqQRo9OYP0LMYZIHC9YBIPqyP0-9GaEg",
  20: "14UJKmvCwatT9HGVLqdDgbpknlClcKapF",
  21: "15_MIFUTxEc_Q4PguTd1bqTaV0fn572kI",
  23: "1-ytJ7dk8JFzB_TOrlvBTazsQcgzeqfrG",
  24: "1nKRbnbsyxCt0EPpq18KWZpqjXdXeJqly",
  26: "1KnL35eBWb4RUPwKkUXFfXIERk7_mEqet",
  27: "117LJCfC4SKlBir3hSvqES50irNRGE6uz",
  28: "1u3x7uApk4EX7xaJ4K0GIU_7mg0PRSMay",
  30: "1i-_FHZNI9ILrpUsu9CQ6AfxYX_U8Tgej",
  31: "1bSyPyUAott6hsATKdGb1h3CpnwmtQhjM",
  32: "1l-SEawwhD1vY_mPT36OvP0woPtBzcwpj",
  34: "11fITmdpBG0_t6vzJer0kFOnakH4cPJLI",
  35: "18iEmK2IopbX7yDyYN7kga8d-gIpySdUp",
  37: "15HBWHXA6VRt1tvpgVapv6jFI1Zi2bcUS",
  38: "1gNF6hH0XniWm_K22UobNWyCT0aoUUZub",
  43: "1L0wgbC_Pfoh-e1u0ZK3lThr1-_sdYuMk",
  44: "10LhQYHo1KuHFkq9c3zTExvKDvdpBbEIr",
  46: "1JkpVwpD7c8J1FIPT91Zj5Ije7M0yNPHK",
  47: "1VfAGjKob-LcIpifIE-zUOWZGNUNQeQUj",
  48: "1dsiZRCUU18PB2v-ufBBwiBpL4XK_XM6C",
  50: "1uvi7wt1XAYr6P6nnkUrtZCA1g8mn3nbY",
  51: "1a_K_-LCHPzWBJcHGlW2yIlUoYi_Rx9oj",
  54: "190gDyxcsofn5x6OR3uKZIfXT_4esZ0JL",
  56: "1VuN8DLoZcsZ_cPi2pHek2X9AXRAJwpJX",
  57: "1ajuSoF4v50IMhu4HUkF19XOxGn97pPMk",
  59: "1ldXxYLFGJAcJ1qRHQeGvagY0dV9mNJrh",
  60: "1nY7LbiEUp_PvxunhDKKInWVMhXAoNUfm",
  61: "1814Zqy6ue4WAOwNdl7XiKGlEHdMHM5JL",
  62: "1ZOJOlAsfLRjDoC4dDP7oZOTTQ0uCpJfc",
  63: "1APYtF_yylXrnQ0WhkadpXKhG1aCxb8uoz",
  64: "1JR0XYLOXdTRFtTdrzkcblvgtjNftslsi",
  65: "165WjTW3HV929UobfbqHKzIP8MVGSbf1p",
  67: "1JH6K2ydahPXe2g7_Rbzymxp9QNdgp1GF",
  68: "14uFjCu_c6BIRN3vlOgm-c3l-t-_3Kyx6",
  71: "1uuqwUqX8niY9PrWlhwUgHZoMWU7QXLO4",
  72: "1AacO6w4c9rMJDD9MkGzEPSGnMLVNoobz",
  75: "1Oo4AcG8rnikdLsowmlnPNwaXopHjQkwg",
  76: "1L7Zf1W3B7M7hyleqxlPw66jmJVoM4zf7",
  77: "1g_FROOS78Nr14kboa7qKUlXOqvJTcMyP",
  78: "1nQ9M8GKbnTgdWIYP3N6jqZ8cKVQ8AkH1",
  79: "1M9MFtCdB-VTYPMyvWja4sKIBOP722Q8f",
}

const outDir = path.join(__dirname, '../public/players')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const mod = url.startsWith('https') ? https : http
    mod.get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close()
        fs.unlinkSync(dest)
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', err => {
      fs.unlinkSync(dest)
      reject(err)
    })
  })
}

async function run() {
  for (const [id, fileId] of Object.entries(IMAGES)) {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`
    const dest = path.join(outDir, `${id}.jpg`)
    try {
      await download(url, dest)
      console.log(`✅ Downloaded player ${id}`)
    } catch (e) {
      console.log(`❌ Failed player ${id}: ${e.message}`)
    }
  }
}

run()