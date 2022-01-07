import React, {FunctionComponent} from 'react';
import {Layout, Menu, Breadcrumb, Input, Button} from 'antd';
// @ts-ignore

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {asyncGetConnectedAccounts, selectAccounts, selectCostToMint, selectIdentities} from "../store/slices";
import {Form} from 'antd';
import {Row, Col} from 'antd';
import {getContract} from "../components/PaperMastersWeb3";
import Web3  from "web3"
const Identities:FunctionComponent=()=>{

    const dispatch = useDispatch();

    const costToMint = useSelector(selectCostToMint);
    const accounts = useSelector(selectAccounts);

    const createIdentity = (values: any)  => {
            console.log("CREATE IDENTITY");
            console.log(values);
            const contract = getContract();
            if (contract !== undefined) {
                contract.methods.claimIdentity(
                    values.name,
                    values.aka,
                    values.org,
                    values.slogan,
                    values.descr,
                    values.url,
                    values.bio).send({
                            from:  accounts[0],
                            value: Web3.utils.toWei(Web3.utils.toBN(costToMint as number),"finney")
                        }).then((result: any)=>{dispatch(asyncGetConnectedAccounts())});

            }
    }

    return(<div>
        <Row>
            <Col span={10}>
                <h2>  Mint An Identity Cost to Mint {costToMint} finney</h2>
            </Col>
        </Row>

        <Row gutter={16}>

        <Col span={8}>
            <Form id={'minIdentity'} onFinish={createIdentity}>
               <div>
                   <Form.Item name={"name"}>
                    <Input addonBefore={<div style={{width:'100px'}}>Name</div>} />
                   </Form.Item>
                </div>
                <div>
                    <Form.Item name={"aka"}>
                    <Input addonBefore={<div style={{width:'100px'}}>Alias</div>} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"org"}>
                   <Input addonBefore={<div style={{width:'100px'}}>Organization</div>}  />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"slogan"}>
                    <Input addonBefore={<div style={{width:'100px'}}>Slogan</div>} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"descr"}>
                    <Input addonBefore={<div style={{width:'100px'}}>Description</div>} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"url"}>
                    <Input addonBefore={<div style={{width:'100px'}}>URL</div>} />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"bio"}>
                    <Input addonBefore={<div style={{width:'100px'}}>Bio</div>} />
                    </Form.Item>
                </div>
                <div style={{textAlign:"right"}}>
                    <Button type="primary"
                            htmlType="submit">
                        Create Identity
                    </Button>
                </div>
            </Form>
        </Col>


            </Row>



    </div>)
};

export default Identities;


