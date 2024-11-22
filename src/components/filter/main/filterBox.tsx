import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import {ExpandMore, FilterAlt, FilterList} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import {RoleEnum} from '@/utils/enums/role';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

type Props = {
    children: React.ReactNode;
    afterFilterBtn?: React.ReactNode;
    onSubmit: any;
    onSubmitNew?: any;
    loading: boolean;
    isOpen?: boolean;
    submitText?: React.ReactNode;
    submitTextNew?: React.ReactNode;
    areDatesValid?: boolean;
};

export default function FilterBox(props: Props) {
    const formRef = React.useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(props.isOpen ?? false);
    const roles = useSelector((state: RootState) => state.auth.user)?.roles;
    const [buttonClicked, setButtonClicked] = useState('');
    const areDatesValid = props.areDatesValid;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (buttonClicked == 'submitBtn') {
            props.onSubmit(e);
        } else if (buttonClicked == 'submitBtnNew') {
            props.onSubmitNew?.(e);
        }
    };
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            ref={formRef}
            sx={{
                mb: 2,
                background: 'white',
                borderRadius: '12px',
            }}
        >
            <Accordion expanded={isFilterOpen}>
                <AccordionSummary
                    onClick={() => setIsFilterOpen((prevIsFilterOpen) => !prevIsFilterOpen)}
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ml: 1}}>
                        {!isFilterOpen ? <FilterAlt /> : <FilterList />} Filters
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {props.children}
                    <Box>
                        <LoadingButton
                            sx={{
                                textTransform: 'capitalize',
                                px: props.submitText ? 'auto' : 8,
                                m: 1,
                                mr: 'auto',
                            }}
                            loading={props.loading}
                            className="rounded-2xl"
                            variant="contained"
                            type="submit"
                            id="submitBtn"
                            name="submitBtn"
                            onClick={(e) => setButtonClicked('submitBtn')}
                            disabled={!props.areDatesValid}
                        >
                            {props.submitText || 'Submit'}
                        </LoadingButton>

                        {props.onSubmitNew != undefined && roles?.includes(RoleEnum.Admin) && (
                            <LoadingButton
                                sx={{
                                    textTransform: 'capitalize',
                                    px: props.submitTextNew ? 'auto' : 8,
                                    m: 1,
                                    mr: 'auto',
                                }}
                                loading={props.loading}
                                className="rounded-2xl"
                                variant="contained"
                                type="submit"
                                id="submitBtnNew"
                                name="submitBtnNew"
                                onClick={(e) => setButtonClicked('submitBtnNew')}
                                disabled={!props.areDatesValid}
                            >
                                {props.submitTextNew || 'Submit New'}
                            </LoadingButton>
                        )}
                        {props.afterFilterBtn}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
