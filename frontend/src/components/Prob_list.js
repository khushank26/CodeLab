import React, { useContext, useEffect, useState } from "react";
import "./Prob_list.css"
import AuthContext from "../utility/AuthContext";

import { ProblemContent } from "./ProblemContent";

import "./Auth.css"


function Problem() {
    const [problemData, setProblemData] = useState([])

    let { logoutUser, user } = useContext(AuthContext)

    useEffect(() => {
        async function getProblems() {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/prob/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'

                }

            })
            let data = await response.json()
            console.log('get problems')
            setProblemData(data);
        }
        getProblems();
    }, [])

    const problemComponents = [];


    for (let index = 0; index < problemData.length; index++) {
        const value = problemData[index];
        //console.log(value.id, value.problem_description, value.difficulty)
        problemComponents.push(
            <ProblemContent
                id={value.id}
                description={value.problem_description}
                difficulty={value.difficulty}
                title={value.title}
            />
        );
    }
    return <>

        <div className="logo">
            <button className="mainLogo">
                <svg
                    height={24}
                    width={24}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                        fill="currentColor"
                    />
                </svg>
                <span className="logoPos">CodeLAB</span>
            </button>
        </div>

        <div className="profile">
            <div className="card">
                <div className="content">
                    <div className="back">
                        <div className="back-content">




                            <strong style={{ fontSize: 24 }}>Profile</strong>
                        </div>
                    </div>
                    <div className="front">
                        <div className="img">
                            <div className="circle"></div>
                            <div className="circle" id="right"></div>
                            <div className="circle" id="bottom"></div>
                        </div>
                        <div className="front-content">

                            <div className="description">
                                <div className="title">
                                    <p className="title">
                                        <strong>{user.username}</strong>
                                    </p>
                                    <svg
                                        fillRule="nonzero"
                                        height="15px"
                                        width="15px"
                                        viewBox="0,0,256,256"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g
                                            style={{ mixBlendMode: "normal" }}
                                            textAnchor="none"
                                            fontSize="none"
                                            fontWeight="none"
                                            fontFamily="none"
                                            strokeDashoffset={0}
                                            strokeDasharray=""
                                            strokeMiterlimit={10}
                                            strokeLinejoin="miter"
                                            strokeLinecap="butt"
                                            strokeWidth={1}
                                            stroke="none"
                                            fillRule="nonzero"
                                            fill="#20c997"
                                        >
                                            <g transform="scale(8,8)">
                                                <path d="M25,27l-9,-6.75l-9,6.75v-23h18z" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <p className="card-footer">Points Earned &nbsp; | &nbsp; 100</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
        <div className="logout">
            <button onClick={logoutUser}>Logout</button>
        </div>

        <div className="problems-container">

            <div className="Prob">
                Problems
            </div>
        </div>

        <div className="Problem_id">
            {problemComponents}

        </div>

    </>
};

export default Problem;