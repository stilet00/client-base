import React from 'react'
import { Line } from 'react-chartjs-2'
import '../../../styles/modules/SingleChart.css'
import moment from 'moment'

export default function SingleChart({ graph, previousMonth, values }) {
    let dataSets = [
        {
            label: 'Current month',
            fill: true,
            backgroundColor: ['rgba(255,255,255,0.7)'],
            borderColor: ['#ffffff'],
            borderWidth: 0.5,
            data: values,
            tension: 0.4,
            borderDash: [5, 2],
            cubicInterpolationMode: 'monotone',
            borderRadius: 4,
        },
    ]

    const data = {
        _id: graph._id,
        labels: graph.days || [],
        title: moment(`${graph.year}-${graph.month}`).format('MMMM-YYYY'),
        datasets: dataSets,
    }

    let delayed

    const options = {
        animation: {
            onComplete: () => {
                delayed = true
            },
            delay: context => {
                let delay = 0
                if (
                    context.type === 'data' &&
                    context.mode === 'default' &&
                    !delayed
                ) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100
                }
                return delay
            },
        },
        title: {
            color: 'red',
        },
        scales: {
            y: {
                suggestedMin: 0,
                ticks: {
                    color: 'white',
                    beginAtZero: true,
                    callback: function (value) {
                        return value + ' $.'
                    },
                },
            },
            x: {
                ticks: {
                    color: 'white',
                    callback: function (value) {
                        return value + 1 + '.' + graph.month
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: Boolean(previousMonth),
                labels: {
                    color: 'white',
                },
            },
            title: {
                color: 'white',
                display: true,
                text: moment(`${graph.year}-${graph.month}`).format(
                    'MMMM-YYYY'
                ),
            },
            labels: {
                color: 'red',
            },
        },
    }

    return (
        <div className={'single-chart hide-on-mobile-portrait'}>
            <Line data={data} options={options} />
            <div className="total-sum">
                <p className={'total-text'}>{`Total: ${values
                    .reduce((sum, current) => {
                        return sum + Number(current)
                    }, 0)
                    .toFixed(2)} $`}</p>
                <span className={'green-line'} />
                <p className={'total-text'}>{`Middle: ${
                    values.length
                        ? Math.floor(
                              values.reduce((sum, current) => {
                                  return sum + Number(current)
                              }, 0) / values.length
                          )
                        : '0'
                } $`}</p>
            </div>
        </div>
    )
}
