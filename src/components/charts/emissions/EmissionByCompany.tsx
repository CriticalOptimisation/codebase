import { FunctionComponent, memo } from "react";
import { BarChart } from '@mui/x-charts/BarChart';

import { COLOR_OPERATION, COLOR_UPSTREAM, COLOR_DOWNSTREAM, getColorByCategory } from "utils/CategoryColors";
import { formatAmount } from "utils/formatAmounts";
import { capitalize } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ByCompanyDataPoint } from "data/store/types/Types";

interface CompanyData {
    operation: number,
    upstream: number,
    downstream: number,
    cluster: number,
    company: string
}

interface EmissionByCompanyProps {
    emissionData: ByCompanyDataPoint[]
}

const chartOptions = (companies: string[]): ApexCharts.ApexOptions => {
    return {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            parentHeightOffset: 0,
        },
        plotOptions: {
            bar: {
                columnWidth: '25%',
                barHeight: '70%',
                borderRadius: 4
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 8,
            colors: ['transparent']
        },
        xaxis: {
            categories: [...companies]
        },
        yaxis: {
            title: {
                text: '(kton)'
            },
            labels: {
                formatter(val) {
                    return formatAmount(val)
                }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            followCursor: true,
            y: {
                formatter(val) {
                    return `${formatAmount(val)} kton`;
                }
            }
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false
                    }
                }
            }
        ]
    }
}

const valueFormatter = (value: number) => `${value}mm`;

const EmissionByCompany: FunctionComponent<EmissionByCompanyProps> = ({ emissionData }) => {
    const companiesSet = new Set<string>()
    emissionData.forEach(emissionPoint => {
        companiesSet.add(emissionPoint.company)
    })
    const companies = Array.from(companiesSet)

    const seriesByCategories: { [id: string]: (number)[] } = {
        "Operation": Array(companies.length).fill(0),
        "Upstream": Array(companies.length).fill(0),
        "Downstream": Array(companies.length).fill(0)
    }

    emissionData.forEach(emissionPoint => {
        const company = emissionPoint.company
        seriesByCategories["Operation"][companies.indexOf(company)] += emissionPoint.operation
        seriesByCategories["Upstream"][companies.indexOf(company)] += emissionPoint.upstream
        seriesByCategories["Downstream"][companies.indexOf(company)] += emissionPoint.downstream
    })

    const series = Object.keys(seriesByCategories)
        .map(category => {
            return {
                name: category,
                data: seriesByCategories[category],
                color: getColorByCategory(category)
            }
        })

    return (emissionData.length <= 0 ? null : <ReactApexChart
        type="bar"
        options={chartOptions(companies)}
        series={series}
        height="100%"
    />)
}

export default memo(EmissionByCompany)