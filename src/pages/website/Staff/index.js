import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button
} from 'reactstrap';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

import Staff from '../../../components/Staff';

import render from '../../../assets/images/render-2.png';

import { Link } from 'react-router-dom';

import api from '../../../services/api';

import './style.css';

const colors = [
    {
        code: '6',
        name: 'darkorange'
    },
    {
        code: '3',
        name: 'darkaqua'
    },
    {
        code: 'c',
        name: 'red'
    },
    {
        code: '2',
        name: 'darkgreen'
    },
    {
        code: 'a',
        name: 'green'
    }
];

export default class StaffPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            changelog: [],
            showStaffList: false,
            currentStaffGroup: null
        }

        this.toggleStaffList = this.toggleStaffList.bind(this);
    }

    toggleStaffList(group) {
        this.setState({
            showStaffList: true,
            currentStaffGroup: group
        });
    }

    componentDidMount() {
        this._load();
    }

    _load = async () => {
        const result = await api.get('/group');

        const data = result.data;

        const result1 = await api.get('/staff');

        const groups = [];

        for (const group of data) {
            console.log(group);

            const members = [];

            for (const staff of result1.data) {
                if (staff.user.groups.length !== 0 && staff.user.groups[0].group_id === group.id) {
                    members.push(staff.user);
                }

                console.log(staff);
            }

            const color = colors.find(color1 => color1.code === group.color);

            groups.push({
                name: group.prefix.split("[")[1].split("]")[0],
                color: color.name,
                members
            });
        }

        const changelog = await api.get(`/changelog?title=Equipe`);
    
        console.log(groups);

        this.setState({
            groups,
            changelog: changelog.data
        });
    }

    render() {
        return (
            <>
                <Header
                    active="/staff"
                    motd_title="Equipe"
                    motd_message="Conheça os membros da equipe por trás da Rede Focus e saibam que são eles que fazem com que as engrenagens girarem de forma correta e deixam o servidor perfeitinho para você disfrutar das funcionalidades que nele há e jogar tranquilamente."
                    motd_render={render}
                />

                <div className="main">
                    <Container>
                        <Row>
                            <Col md="8">
                                <ul className="group-list">
                                    {
                                        this.state.groups.map(group =>
                                            <li
                                                key={group.name}
                                            >
                                                <Button
                                                    aria-labelledby={group.color}
                                                    onClick={e => this.toggleStaffList(group)}
                                                >
                                                    {group.name}
                                                </Button>
                                            </li>
                                        )
                                    }
                                </ul>
                                {
                                    this.state.showStaffList ?
                                        (
                                            <>
                                                <div className="staff-header" aria-labelledby={this.state.currentStaffGroup.color}>{this.state.currentStaffGroup.name} ({this.state.currentStaffGroup.members.length})</div>
                                                <div className="staff-list shadow-sm">
                                                    <Row>
                                                        {
                                                            this.state.currentStaffGroup.members.length !== 0 ?
                                                                this.state.currentStaffGroup.members.map(member =>
                                                                    <Col
                                                                        key={member.id}
                                                                        md="3"
                                                                    >
                                                                        <Staff
                                                                            username={member.display_name}
                                                                            twitter_access_token={member.twitter_access_token}
                                                                            twitter_token_secret={member.twitter_token_secret}
                                                                            color={this.state.currentStaffGroup.color}
                                                                            group={this.state.currentStaffGroup.name}
                                                                        />
                                                                    </Col>
                                                                )
                                                                :
                                                                (
                                                                    <>
                                                                        <h3>Não há ninguém nesse grupo.</h3>
                                                                    </>
                                                                )
                                                        }
                                                    </Row>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            null
                                        )
                                }
                            </Col>
                            <Col md="4">
                                <Card
                                    className="mb-4"
                                >
                                    <div
                                        className="h4 text-center"
                                    >
                                        Entre para nossa equipe
                                    </div>
                                    <CardBody
                                        className="p-4 focus-content"
                                    >
                                        <div
                                            className="h6 text-center text-justify font-weight-light mb-2"
                                        >
                                            Aplique-se e ajude essa família a crescer
                                        </div>
                                        <div
                                            className="text-center pt-2"
                                        >
                                            <Button
                                                tag={Link}
                                                to="#"
                                                color="danger"
                                                className="btn-rounded shadow-sm text-white"
                                                style={{
                                                    borderRadius: '25rem'
                                                }}
                                            >
                                                Integrar a equipe
                                            </Button>
                                            <p
                                                className="text-muted font-weight-lihgt mt-2 mb-0"
                                            >
                                                <small>
                                                    Ainda não há vagas abertas
                                                </small>
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card
                                    className="mb-4 border-0"
                                >
                                    <div
                                        className="h4 text-center"
                                    >
                                        Últimas atualizações
                                    </div>
                                    <CardBody
                                        className="p-4 focus-content"
                                    >
                                        <ul style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            padding: '5px',
                                            margin: '0',
                                            listStyle: 'none'
                                        }}>
                                            {
                                                this.state.changelog.slice(0, 5).map(changelog => (
                                                    <li key={changelog.id}>
                                                        {changelog.message}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        <div className="mt-2 text-center">
                                            <Button
                                                tag={Link}
                                                to="/changelog?title=Equipe"
                                                color="danger"
                                                className="btn-rounded shadow-sm text-white"
                                                style={{
                                                    borderRadius: '25rem'
                                                }}
                                            >
                                                Ler mais...
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Footer />
            </>
        );
    }
}