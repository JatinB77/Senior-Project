import React from 'react';
import { Container, Button, Input, Row, Col, InputGroup, InputGroupAddon } from 'reactstrap';
import DropzoneHQNav from '../Navs/DropzoneHQNav.jsx';
import { Link } from 'react-router-dom';

export default class PasswordResetScreen extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container id="main_body">
                <Row>
                    <Col className="mainscreen_col" xs={{ size: 12 }}>
                        <img src="http://svgshare.com/i/3vT.svg" class="behind_nav img-responsive img-circle center-block" height="100" width="100"></img>
                    </Col>
                    <Col className="mainscreen_col" xs={{ size: 12, offset: 0 }} sm={{ size: 10, offset: 1 }} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
                        <InputGroup>
                            <InputGroupAddon>Dropzone Email: </InputGroupAddon>
                            <Input type='email' />
                        </InputGroup>
                        <Button className="btn_transparent" size="lg">Login</Button>
                        <Link to='/main-menu'><Button className="btn_transparent" size="lg">Back to Main</Button></Link>
                    </Col>
                </Row>
            </Container>
        );
    }
}