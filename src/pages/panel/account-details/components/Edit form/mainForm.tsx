import {IBankAccount, IQRItem} from '@/utils/interfaces/bankAccount.interface';
import {Grid} from '@mui/material';
import React from 'react';
import EditForm from './editForm';
import OtherForm from './otherForm';
import DynamicFormKeyValue from '@/components/dialogs/DynamicKeyValueDailog';
import ExtraAddedDetails from './extraAddedDetails';
import RemarkModal from './remarkModal';
import {IOptionItem} from '@/components/filter/main/filterSelect';
import BankAmountRanges from '../bankAmountRanges';
import PaymentMethods from '../PaymentMethods';
import QRCodeForm from '../QRForm';
import {IBankAmountRange} from '../bankRangeDialog';
import {BankAccountTypesEnum} from '@/utils/enums/accountDetails.enums';

interface KeyValuePair {
    key: string;
    value: string;
}

interface Props {
    vendorsLoading: boolean;
    handleSelectChange: (name: string, value: any) => void;
    formData: IBankAccount;
    banksLoading: boolean;
    bankOptions: IOptionItem[];
    handleInputChange: React.ChangeEvent<HTMLInputElement> | any;
    vendorOptions: IOptionItem[];
    bankAccountData: any;
    OpenKeyValueDailog: () => void;
    editData: IBankAccount | any;
    isEditAccountOtherFields: boolean | any;
    statusOptions: IOptionItem[];
    hasActiveDetails: any;
    OpenKeyValueViewDailog: () => void;
    handleFormSubmit: (data: KeyValuePair[]) => void;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
    handleViewDialogClose: () => void;
    keyValueList: any;
    editIndex: number | null;
    newKeyValue: {
        key: '';
        value: '';
    };
    setNewKeyValue: React.Dispatch<React.SetStateAction<KeyValuePair>>;
    handleSaveEdit: () => void;
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
    handleEditClick: (index: number) => void;
    handleDelete: (index: number) => void;
    handleUndo: (index: number) => void;
    handleEdit: (data?: any) => void;
    openViewDialog: boolean;
    open: boolean;
    style: {};
    validation: boolean;
    setRemarksAndAmount: () => void;
    prop: any;
    account: number | any;
    qrCodes: IQRItem[];
    setQrCodes: React.Dispatch<React.SetStateAction<IQRItem[]>>;
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
    selectedRange: string | IBankAmountRange;
    setSelectedRange: React.Dispatch<React.SetStateAction<string | IBankAmountRange>>;
}
const MainForm = (props: Props) => {
    const {
        vendorsLoading,
        handleSelectChange,
        OpenKeyValueViewDailog,
        hasActiveDetails,
        statusOptions,
        isEditAccountOtherFields,
        formData,
        banksLoading,
        editData,
        bankOptions,
        handleInputChange,
        vendorOptions,
        bankAccountData,
        handleFormSubmit,
        openDialog,
        setOpenDialog,
        handleClose,
        handleViewDialogClose,
        keyValueList,
        editIndex,
        newKeyValue,
        setNewKeyValue,
        handleSaveEdit,
        setEditIndex,
        handleEditClick,
        handleDelete,
        handleUndo,
        handleEdit,
        OpenKeyValueDailog,
        openViewDialog,
        open,
        style,
        validation,
        setRemarksAndAmount,
        prop,
        account,
        qrCodes,
        setQrCodes,
        selectedPaymentMethods,
        setSelectedPaymentMethods,
        selectedRange,
        setSelectedRange,
    } = props;

    return (
        <>
            <Grid container spacing={1.5}>
                <EditForm
                    vendorsLoading={vendorsLoading}
                    handleSelectChange={handleSelectChange}
                    // account={account}
                    formData={formData}
                    banksLoading={banksLoading}
                    bankOptions={bankOptions}
                    handleInputChange={handleInputChange}
                    vendorOptions={vendorOptions}
                    bankAccountData={bankAccountData}
                    OpenKeyValueDailog={OpenKeyValueDailog}
                    isEditAccountOtherFields={isEditAccountOtherFields}
                    editData={editData}
                    statusOptions={statusOptions}
                    hasActiveDetails={hasActiveDetails}
                    OpenKeyValueViewDailog={OpenKeyValueViewDailog}
                />
                <OtherForm formData={formData} handleInputChange={handleInputChange} />
                <DynamicFormKeyValue
                    onSubmit={handleFormSubmit}
                    initialValues={[{key: '', value: ''}]}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />
                <ExtraAddedDetails
                    handleClose={handleClose}
                    handleViewDialogClose={handleViewDialogClose}
                    keyValueList={keyValueList}
                    editIndex={editIndex}
                    newKeyValue={newKeyValue}
                    setNewKeyValue={setNewKeyValue}
                    handleSaveEdit={handleSaveEdit}
                    setEditIndex={setEditIndex}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                    handleUndo={handleUndo}
                    handleEdit={handleEdit}
                    OpenKeyValueDailog={OpenKeyValueDailog}
                    formData={formData}
                    openViewDialog={openViewDialog}
                />
                {account === BankAccountTypesEnum.payin && (
                    <BankAmountRanges
                        selectedRange={selectedRange as IBankAmountRange}
                        setSelectedRange={setSelectedRange}
                    />
                )}{' '}
                {account === BankAccountTypesEnum.payin && (
                    <Grid item xs={12}>
                        <PaymentMethods
                            selectedPaymentMethods={selectedPaymentMethods}
                            setSelectedPaymentMethods={setSelectedPaymentMethods}
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                    </Grid>
                )}
                {account === BankAccountTypesEnum.payin && (
                    <Grid item xs={12}>
                        <QRCodeForm qrCodes={qrCodes} setQrCodes={setQrCodes} />
                    </Grid>
                )}
                <RemarkModal
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prop={prop}
                    open={open}
                    style={style}
                    handleClose={handleClose}
                    validation={validation}
                    setRemarksAndAmount={setRemarksAndAmount}
                />
            </Grid>
        </>
    );
};

export default MainForm;
