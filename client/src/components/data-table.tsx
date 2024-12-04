import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface DataTableProps {
    columns: any[];
    dataSource: any[];
    rowKey: string;
    onDownload: (table: any[], title: string) => void;
    downloadTitle: string;
    pageSize?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    dataSource,
    rowKey,
    onDownload,
    downloadTitle,
    pageSize = 8, 
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleTableChange = (page: number, pageSize: number) => {
        setCurrentPage(page); 
    };

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = dataSource.slice(startIndex, startIndex + pageSize);

    return (
        <>
            <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey={rowKey}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: dataSource.length,
                    onChange: (page) => handleTableChange(page, pageSize), 
                    showSizeChanger: false,
                }}
            />
            <Button
                icon={<DownloadOutlined />}
                className="mt-10 p-6 bg-[#000091] text-white"
                onClick={() => onDownload(dataSource, downloadTitle)}
            >
                Télécharger en XLSX
            </Button>
        </>
    );
};
