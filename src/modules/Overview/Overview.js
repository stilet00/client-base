import React, { useState } from 'react';
import Header from "../../shared/Header/Header";
import { getBalance } from "../../services/balanceServices/services";
import { getClients } from "../../services/clientsServices/services";
import moment from "moment";
import "./Overview.css";
import Loader from "../../shared/Loader/Loader";
import { getTranslators } from "../../services/translatorsServices/services";

function Overview (props) {
    const [charts, setCharts] = useState([]);
    const [currentYear, setCurrentYear] = useState(moment().format('YYYY'))
    const [clients, setClients] = useState([]);
    const [translators, setTranslators] = useState([]);
    useState(() => {
        getBalance().then(res => {
            setCharts(res.data.filter(item => item.year === currentYear));
        });
        getClients().then(res => {
            setClients(res.data)
        })
        getTranslators().then(res => {
            setTranslators(res.data)
        })


    }, [])
    function reduceArray(array) {
        return array.reduce((sum = 0, current) => {
            return Number(sum) + Number(current)
        })
    }
    function getSumm() {
        let arrayOfSums = [];
        if (charts.length) {
            charts.forEach(item => {
                arrayOfSums.push((reduceArray(item.values)))
            })
            return reduceArray(arrayOfSums)
        }

    }
    return (
        <>
            <Header />
            <div className={"taskList-container chart-container table-container"}>
                <table>
                    <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>CurrentYear</td>
                        <td><b>{moment().format("YYYY")}</b></td>
                    </tr>
                    <tr>
                        <td>Year's total</td>
                        <td><b>{`${getSumm()} $`}</b></td>
                    </tr>
                    <tr>
                        <td>Salary payed</td>
                        <td><b>{`${Math.floor(getSumm()*0.4)} $`}</b></td>
                    </tr>
                    <tr>
                        <td>Total clients</td>
                        <td><b>{clients.length ? clients.length : <Loader />}</b></td>
                    </tr>
                    <tr>
                        <td>Total translators</td>
                        <td><b>{translators.length ? translators.length : <Loader />}</b></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Overview;