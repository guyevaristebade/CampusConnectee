// DataTable.tsx
import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface DataTableProps {
    columns: any[];
    dataSource: any[];
    rowKey: string;
    onDownload: (table : any[], title:string) => void;
    downloadTitle: string;
    handleTableChange: (pagination: any) => void;
    pageSize : number;
    currentPage: number;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, dataSource, rowKey, onDownload, downloadTitle, handleTableChange, currentPage, pageSize}) => {;
    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={rowKey}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: dataSource.length,
                    onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                }}
            />
            <Button
                icon={<DownloadOutlined />}
                className='mt-10 bg-[#00B050] text-white'
                onClick={() => onDownload(dataSource,downloadTitle)}
            >
                Télécharger en XLSX
            </Button>
        </>
    );
};

