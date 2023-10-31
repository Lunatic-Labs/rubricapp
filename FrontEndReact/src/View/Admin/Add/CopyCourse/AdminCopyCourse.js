import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';

<div id="outside">
                    <h1 id="addCourseTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Modify New Course</h1>
                    <div id="addCourseDescription" className="d-flex justify-content-around">Please make any changes to the new course</div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="firstNameLabel">Course Name</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="courseName" name="newCourseName" className="m-1 fs-6" style={{}} placeholder="Course Name" required/>
                            </div>
                        </div>
                    </div>
                   - <h1 id="copyCourseTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}> Select the Course</h1>
                    <div id="copyCourseDescription" className="d-flex justify-content-around">Please select the course you would like to copy</div>
                    <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="firstNameLabel">Copy Course</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="dropdown" id="courseName" name="newCourseName" className="m-1 fs-6" style={{}} placeholder="Course Name" required/>
                            </div>
                        </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label htmlFor="exampleDataList" className="form-label">Term</label>
                            </div>
                        <div className="w-75 p-2 justify-content-around">
                            <input type="text" id="term" name="newTerm" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Spring" required/>
                            <datalist id="datalistOptions" style={{}}>
                                <option value="Fall"/>
                                <option value="Spring"/>
                                <option value="Summer"/>
                            </datalist>
                        </div>
                    </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="termLabel">Year</label>
                            </div>
                            <div className="w-75 p-2 justify-content-between">
                                <input type="text" id="year" name="newTerm" className="m-1 fs-6" style={{}} placeholder="e.g. 2024" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="activeLabel">Active</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input type="checkbox" id="active" name="newActive" className="m-1 fs-6" style={{}} required/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="fixedTeamsLabel">Fixed Teams</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input type="checkbox" id="useFixedTeams" name="newFixedTeams" className="m-1 fs-6" style={{}} required/>
                            </div>
                        </div>
                    </div>
                </div>
                