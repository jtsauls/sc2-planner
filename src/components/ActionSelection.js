import React, { Component } from 'react'
import ReactTooltip from "react-tooltip";

import RESOURCES from '../constants/resources'
import {CUSTOMACTIONS} from '../constants/customactions'
import CLASSES from "../constants/classes"
import UNITS from '../constants/units'
import STRUCTURES from '../constants/structures'
import UPGRADES from "../constants/upgrades"
// import { GameLogic } from '../game_logic/gamelogic';

// Importing json doesnt seem to work with `import` statements, but have to use `require`
const UNIT_ICONS = require("../icons/unit_icons.json")
const UPGRADE_ICONS = require("../icons/upgrade_icons.json")

export default class ActionsSelection extends Component {
    // TODO If a button is pressed, add item to build order
    constructor(props) {
        super(props)
        this.state = {
            tooltipText: ""
        }
        this.classString = `${CLASSES.icon}`

        // Load unit icons
        this.unitIcons = {}
        Object.keys(UNIT_ICONS).forEach((item) => {
            this.unitIcons[item] = require(`../icons/png/${UNIT_ICONS[item]}`)
        });

        // Load upgrade icons
        this.upgradeIcons = {}
        Object.keys(UPGRADE_ICONS).forEach((item) => {
            this.upgradeIcons[item] = require(`../icons/png/${UPGRADE_ICONS[item]}`)
            // console.log(item);
            // console.log(this.upgradeIcons[item]);
        });
    }

    onMouseEnter = (e, item) => {
        this.setState({
            tooltipText: item
        })
    }

    render() {
        let latestSnapshot = this.props.gamelogic.getBOIndexSnapshots()[this.props.gamelogic.getHighestBOSnapshotIndex()]
        // Is undefined on first frame = when build order is empty
        if (!latestSnapshot) {
            latestSnapshot = this.props.gamelogic
        }

        const resources = RESOURCES.map((item, index) => {
            const myStyle = {
                "bottom": "0%",
                "right": "0%",
            }
            // Instead of getting the status when the last element finished, get the state after the last build order index was started
            let value = "";
            if (item.name === "Supply") {
                value = `${latestSnapshot.supplyUsed}/${latestSnapshot.supplyCap}`
            } else {
                value = `${Math.round(latestSnapshot[item.name.toLowerCase()])}`
            }
            
            return <div key={item.name} className={`relative ${this.classString}`}>
                <img src={require("../icons/png/" + item.path)} alt={item.name} />
                <div className={CLASSES.actionIconText} style={myStyle}>
                    {value}
                </div>
            </div>
        });

        const customactions = CUSTOMACTIONS.all.concat(CUSTOMACTIONS[this.props.race]).map((item, index) => {
            // Update tooltip function
            const mouseEnterFunc = (e) => {
                return this.onMouseEnter(e, 
                    <div className="flex flex-col">
                        <div>{item.name}</div>
                        <div>Duration: {item.duration}s</div>
                    </div>
                )
            }
            return <div data-tip data-for='actionTooltip' key={item.name} onMouseEnter={mouseEnterFunc} onClick={(e) => {this.props.actionClick(e, item)}}>
                <img className={this.classString} src={require("../icons/png/" + item.imageSource)} alt={item.name} />
            </div>
        })

        const units = UNITS[this.props.race].map((item, index) => {
            // Update tooltip function
            const mouseEnterFunc = (e) => {
                return this.onMouseEnter(e, 
                    <div className="flex flex-col text-center">
                        <div>Build unit</div>
                        <div>{item.name}</div>
                        <div>Minerals: {item.minerals}</div>
                        <div>Vespene: {item.gas}</div>
                        <div>Supply: {item.supply}</div>
                        <div>Train time: {Math.round(item.time / 22.4)}s</div>
                    </div>
                )
            }
            const icon = this.unitIcons[item.name.toUpperCase()]
            return <div data-tip data-for='actionTooltip' key={item.name} onMouseEnter={mouseEnterFunc} onClick={(e) => {this.props.unitClick(e, item.name)}}>
                <img className={this.classString} src={icon} alt={item.name} />
            </div>
        });

        const structures = STRUCTURES[this.props.race].map((item, index) => {
            // Update tooltip function
            const mouseEnterFunc = (e) => {
                return this.onMouseEnter(e, 
                    <div className="flex flex-col text-left">
                        <div>Build structure</div>
                        <div>{item.name}</div>
                        <div>Minerals: {item.minerals}</div>
                        <div>Vespene: {item.gas}</div>
                        <div>Build time: {Math.round(item.time / 22.4)}s</div>
                    </div>
                )
            }
            const icon = this.unitIcons[item.name.toUpperCase()]
            return <div data-tip data-for='actionTooltip' key={item.name} onMouseEnter={mouseEnterFunc} onClick={(e) => {this.props.structureClick(e, item.name)}}>
                <img className={this.classString} src={icon} alt={item.name} />
            </div>
        });
        
        const upgrades = UPGRADES[this.props.race].map((item, index) => {
            // Update tooltip function
            const mouseEnterFunc = (e) => {
                return this.onMouseEnter(e, 
                    <div className="flex flex-col">
                        <div>Research upgrade</div>
                        <div>{item.name}</div>
                        <div>Minerals: {item.cost.minerals}</div>
                        <div>Vespene: {item.cost.gas}</div>
                        <div>Research time: {Math.round(item.cost.time / 22.4)}s</div>
                    </div>
                )
            }
            const icon = this.upgradeIcons[item.name.toUpperCase()]
            return <div data-tip data-for='actionTooltip' key={item.name} onMouseEnter={mouseEnterFunc}  onClick={(e) => {this.props.upgradeClick(e, item.name)}}>
                <img className={this.classString} src={icon} alt={item.name} />
            </div>
        });
        
        return (
            <div>
                <ReactTooltip place="left" id="actionTooltip">{this.state.tooltipText}</ReactTooltip>
                <div className={CLASSES.actionContainer}>{resources}</div>
                <div className={CLASSES.actionContainer}>{customactions}</div>
                <div className={CLASSES.actionContainer}>{units}</div>
                <div className={CLASSES.actionContainer}>{structures}</div>
                <div className={CLASSES.actionContainer}>{upgrades}</div>
            </div>
        )
    }
}