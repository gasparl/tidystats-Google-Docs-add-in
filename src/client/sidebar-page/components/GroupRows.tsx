import { Group } from "../classes/Group"
import { Statistic } from "../classes/Statistic"

import { StatisticsRows } from "./StatisticsRows"
import { Collapsible } from "./Collapsible"

import { serverFunctions } from '../../utils/serverFunctions';

type GroupRowsProps = {
    name: string
    statistics?: Statistic[]
    groups?: Group[]
}

const GroupRows = (props: GroupRowsProps) => {
    const { name, statistics, groups } = props

    let content

    if (statistics) {
        content = <StatisticsRows statistics={statistics} />
    }

    let addTable = false
    if (groups) {
        content = (
            <>
                {groups.map((x) => {
                    let group

                    if (x.groups) {
                        group = <GroupRows key={x.name} name={x.name} groups={x.groups} />
                    }

                    if (x.statistics) {
                        group = (
                            <GroupRows key={x.name} name={x.name} statistics={x.statistics} />
                        )
                    }

                    return group
                })}
            </>
        )

        // Add addTable() function if all the stat names are identical between all groups
        const stat_names = groups.map((x) => {
            // get all stat names
            if (x.statistics instanceof Array) {
                return JSON.stringify(x.statistics.map((stat) => {
                    return stat.name
                }))
            } else {
                return null
            }
        })
        //alert(JSON.stringify(stat_names))

        // check if names (if any) identical between groups
        if (!stat_names.includes(undefined) && !stat_names.includes(null)) {
            const stat_names_set = new Set(stat_names)
            if (stat_names_set.size === 1) addTable = true
        }
    }


    const handleAddClick = () => {
        serverFunctions.insertTable(name, JSON.stringify(groups)).catch(alert)
    }

    return (
        <Collapsible
            primary={false}
            bold={true}
            name={name}
            content={content}
            handleAddClick={addTable ? handleAddClick : undefined}
            open={false}
            table={addTable}
        />
    )
}

export { GroupRows }
