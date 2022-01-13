import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('adding');

  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Failed to add please try again！');
    return false;
  }
};
/**
 * update node
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('configuring');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('Configured successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('deleting');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Identity name',
      dataIndex: 'name',
      tip: 'NFT Identities are unique',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'desc',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Personal',
          status: 'Default',
        },
        1: {
          text: 'Company',
          status: '',
        },
        2: {
          text: 'Idea',
          status: '',
        },
        3: {
          text: 'Place',
          status: '',
        },
      },
      valueType: 'textarea',
    },
    {
      title: 'number of service calls',
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val}ten thousand`,
    },
    {
      title: 'state',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Valid',
          status: 'Default',
        },
        1: {
          text: 'Invalid',
          status: 'Processing',
        },
        2: {
          text: 'Scam',
          status: 'Success',
        },
        3: {
          text: 'Imposter',
          status: 'Error',
        },
      },
    },
    {
      title: 'Last activity',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="Please enter the exception reason！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: 'operate',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          configure
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          Subscribe to Alerts
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Inquiry form"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalVisible(true);
          //   }}
          // >
          //   <PlusOutlined /> new
          // </Button>,
        ]}
        request={rule}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              chosen{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              item &nbsp;&nbsp;
              <span>
                Total number of service calls {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} ten thousand
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            batch deletion
          </Button>
          <Button type="primary">Batch approval</Button>
        </FooterToolbar>
      )}
      {/*<ModalForm*/}
      {/*  title="New rule"*/}
      {/*  width="400px"*/}
      {/*  visible={createModalVisible}*/}
      {/*  onVisibleChange={handleModalVisible}*/}
      {/*  onFinish={async (value) => {*/}
      {/*    const success = await handleAdd(value as TableListItem);*/}
      {/*    if (success) {*/}
      {/*      handleModalVisible(false);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ProFormText*/}
      {/*    rules={[*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        message: 'Rule name is required',*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    width="md"*/}
      {/*    name="name"*/}
      {/*  />*/}
      {/*  <ProFormTextArea width="md" name="desc" />*/}
      {/*</ModalForm>*/}
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
