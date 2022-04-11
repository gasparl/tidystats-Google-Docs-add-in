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

  findStatistic(id: string) {
    // Split the identifier up in the separate components
    const components = id.split("$")

    // Check if the statistic is a lower or upper bound statistic
    // If so, remove the last component
    if (components[components.length - 1].match(/lower|upper/)) {
      components.pop()
    }

    // Split up the components into the identifier, the statistics name, and everything else as group names
    const identifier = components[0]
    const statisticName = components[components.length - 1]
    const groupNames = components.slice(1, components.length - 1)

    // Find the analysis based on the identifier
    const analysis = this.analyses.find((x) => x.identifier === identifier)

    // Find the statistics
    let statistic, statistics

    if (groupNames.length) {
      let groups, group

      groups = analysis?.groups

      for (let i = 0; i < groupNames.length; i++) {
        group = groups?.find((x) => x.name === groupNames[i])

        if (i < groupNames.length) {
          group = groups?.find((x) => x.name === groupNames[i])
          groups = group?.groups
        }
      }

      statistics = group?.statistics
    } else {
      statistics = analysis?.statistics
    }

    // Find the statistic
    statistic = statistics?.find((x) => x.name === statisticName)

    return statistic
  }
}

export { Tidystats }
