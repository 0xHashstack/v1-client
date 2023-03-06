import React from 'react'
import { UncontrolledAccordion } from 'reactstrap'
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Modal,
    Row,
    Table,
  } from "reactstrap";
import RepayLoans from './RepayLoans';
import { EventMap } from '../../../blockchain/constants';

const RepayloanShow = ({repaidLoansData}:{repaidLoansData:any}) => {
    // console.log(repaidLoansData);
    
    return (
        <>
            <div className="table-responsive  mt-3" style={{ overflow: "hidden" }}>
                <UncontrolledAccordion
                    defaultOpen="0"
                    open="false"
                    style={{
                        margin: "10px",
                        textAlign: "left",
                        marginLeft: "20px",
                    }}
                >
                    
                    <Table>
                        {/* <Table className="table table-nowrap  mb-0"> */}
                        <Row
                            style={{
                                marginTop: "-20px",
                                marginLeft: "10px",
                                borderStyle: "hidden",
                                color: "rgb(140, 140, 140)",
                                fontWeight: "300",
                                alignItems: "center",
                                gap: "30px",
                                fontSize: "14px",
                            }}
                        >
                            <Col
                                style={{
                                    width: "10px",
                                    padding: "20px 10px 20px 30px",
                                }}
                            >
                                Borrow ID
                            </Col>
                            <Col
                                style={{
                                    width: "100px",
                                    padding: "20px 10px",
                                }}
                            >
                                Market
                            </Col>
                            <Col style={{ width: "100px", padding: "20px 10px" }}>
                                Borrow Amount
                            </Col>
                            <Col
                                scope="col"
                                style={{ width: "100px", padding: "20px 10px" }}
                            >
                                APR
                            </Col>
                            <Col
                                scope="col"
                                style={{ width: "100px", padding: "20px 10px" }}
                            >
                                Risk Premium
                            </Col>
                            <Col
                                scope="col"
                                style={{ width: "100px", padding: "20px 10px" }}
                            >
                                MCP
                            </Col>
                            <Col
                                scope="col"
                                style={{ width: "100px", padding: "20px 10px" }}
                            >
                                Collateral Market
                            </Col>
                            <Col
                                scope="col"
                                style={{ width: "100px", padding: "20px 10px" }}
                            >
                                Collateral Amount
                            </Col>
                        </Row>
                        {/* </Table> */}
                    </Table>
                    {repaidLoansData.map((key:any,assets:any)=>{
                        // console.log(assets);
                        // console.log(key);
                        return(
                        <RepayLoans key={key} assets={assets} />
                        )
                    })}
                </UncontrolledAccordion>
            </div>
        </>
    )
}

export default RepayloanShow