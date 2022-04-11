import { Analysis } from "./Analysis"

class Tidystats {
  analyses: any[] // Analysis[]

  constructor(data: { [key: string]: any }) {
    let analyses = []

    for (let key of Object.keys(data)) {
      const analysis = new Analysis(key, data[key])
      analyses.push(analysis)
    }

    this.analyses = analyses
  }

}

export { Tidystats }
