import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Statistics = ({ token }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
                text: "Chart.js Bar Chart",
            },
        },
    };

    const [labels, setLabels] = useState([]);
    const [worst, setWorst] = useState([]);
    const [choices, setChoices] = useState([]);
    const [enableWorst, setEnableWorst] = useState(false);
    const [data, setData] = useState({});

    const getStatistic = async () => {
        try {
            const { data } = await axios.get(`http://localhost:49706/poll/lack/${token}`);
            setEnableWorst(data.poll.body.setting.worst);
            const optionsObject = data.poll.body.options;
            const choicesObject = data.options;

            const labelsArray = [];
            optionsObject.forEach((option) => {
                labelsArray.push(option.text);
            });
            setLabels(labelsArray);

            const choicesDataArray = [];
            const worstDataArray = [];
            choicesObject.forEach((choice) => {
                choicesDataArray.push(choice.voted.length);
                worstDataArray.push(choice.worst.length);
            });
            setChoices(choicesDataArray);
            setWorst(worstDataArray);
            setData({
                labels: labelsArray,
                datasets: [
                    {
                        label: "Choice",
                        data: choicesDataArray,
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                    {
                        label: "Worst",
                        data: worstDataArray,
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                ],
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getStatistic();
    }, []);

    return choices.length > 0 && worst.length > 0 ? (
        <Bar options={options} data={data} />
    ) : null;
};

export default Statistics;
