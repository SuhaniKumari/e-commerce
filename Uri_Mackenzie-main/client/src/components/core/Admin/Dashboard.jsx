import React, { useEffect, useState } from 'react'
import style from './Admin.module.css'
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
import { getGraphData } from 'services/operations/productAPI';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const [products, setProducts] = useState();
    const [orders, setOrders] = useState();
    const [users, setUsers] = useState();
    const [loader, setLoader] = useState(true);

    const { categories } = useSelector(state => state.products);

    useEffect(() => {
        getGraphData(setProducts, setOrders, setUsers, setLoader);
    }, []);

    if (loader) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    let outOfStock = 0;
    let total = 0;
    products?.forEach((item) => {
        console.log(item);
        item.subDetails.forEach((s) => {
            s.sizes.forEach((i) => {
                total++;
                if (i.stock === 0) {
                    outOfStock++;
                }
            })
        })
    });


    let totalAmount = orders?.reduce((total, order) => total + order.totalPrice, 0);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const date = new Date();
    const lineState = {
        labels: months,
        datasets: [
            {
                label: `Sales in ${date.getFullYear() - 2}`,
                borderColor: '#8A39E1',
                backgroundColor: '#8A39E1',
                data: months.map((m, i) => orders?.filter((od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === date.getFullYear() - 2).reduce((total, od) => total + od.totalPrice, 0)),
            },
            {
                label: `Sales in ${date.getFullYear() - 1}`,
                borderColor: 'orange',
                backgroundColor: 'orange',
                data: months.map((m, i) => orders?.filter((od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === date.getFullYear() - 1).reduce((total, od) => total + od.totalPrice, 0)),
            },
            {
                label: `Sales in ${date.getFullYear()}`,
                borderColor: '#4ade80',
                backgroundColor: '#4ade80',
                data: months.map((m, i) => orders?.filter((od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === date.getFullYear()).reduce((total, od) => total + od.totalPrice, 0)),
            },
        ],
    };

    // const statuses = ['Processing', 'Shipped', 'Delivered'];
    const uniqueStatuses = new Set(orders?.map((order) => order.orderDetails.status));
    const statuses = [...uniqueStatuses]

    const pieState = {
        labels: statuses,
        datasets: [
            {
                backgroundColor: ['#9333ea', '#facc15', '#4ade80'],
                hoverBackgroundColor: ['#a855f7', '#fde047', '#86efac'],
                data: statuses.map((status) => orders?.filter((item) => item.orderDetails.status === status).length),
            },
        ],
    };

    const doughnutState = {
        labels: ['Out of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['#ef4444', '#22c55e'],
                hoverBackgroundColor: ['#dc2626', '#16a34a'],
                data: [outOfStock, total - outOfStock],
            },
        ],
    };

    const barState = {
        labels: categories.map((cat) => cat.name), // Use category.name for labels
        datasets: [
            {
                label: "Products",
                borderColor: '#9333ea',
                backgroundColor: '#9333ea',
                hoverBackgroundColor: '#6b21a8',
                data: categories.map((cat) => {
                    if (products) {
                        return products.filter((item) => item.category === cat._id).length;
                    } else {
                        return 0;
                    }
                }),
            },
        ],
    };

    return (
        <div className={style.Dashboard}>
            <div>
                <div className={style.data}>
                    <div >
                        <h4>Total Sales Amount</h4>
                        <h2>₹{totalAmount?.toLocaleString()}</h2>
                    </div>
                    <div>
                        <h4>Total Orders</h4>
                        <h2>{orders?.length}</h2>
                    </div>
                    <div>
                        <h4>Total Products</h4>
                        <h2>{products?.length}</h2>
                    </div>
                    <div>
                        <h4>Total Users</h4>
                        <h2>{users?.length}</h2>
                    </div>
                </div>

                <div className={style.graph}>
                    <div>
                        <Line data={lineState} />
                    </div>

                    <div>
                        <span>Order Status</span>
                        <Pie data={pieState} />
                    </div>
                </div>

                <div className={style.graph}>
                    <div>
                        <Bar data={barState} />
                    </div>

                    <div>
                        <span>Stock Status</span>
                        <Doughnut data={doughnutState} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard