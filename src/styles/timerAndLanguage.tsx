import {asset} from '@/utils/functions/global';
import {KeyboardArrowDown} from '@mui/icons-material';
import {Box, Menu, MenuItem} from '@mui/material';
import React from 'react';

interface ITimerAndLanguage {
    remainingTime: any;
    handleClick: any;
    lang: string;
    anchorEl: any;
    openLang: boolean;
    handleClose: any;
    $translate: any;
}
export const TimerAndLanguage: React.FC<ITimerAndLanguage> = ({
    handleClose,
    openLang,
    anchorEl,
    lang,
    handleClick,
    remainingTime,
    $translate,
}) => {
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '13px 16px',
                    boxShadow: '7px 13px 45px rgba(0, 0, 0, 0.5)',
                    backgroundColor: '#fafafa',
                }}
            >
                <div className="f-16" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <img
                        src={asset(`img/timer.png`)}
                        alt={`Timer logo`}
                        width={15}
                        style={{
                            height: '19px',
                        }}
                    />
                    <div className="f-16" style={{color: '#595959'}}>
                        {`${Math.floor(remainingTime / 60)}:${(remainingTime % 60)
                            .toString()
                            .padStart(2, '0')}`}
                    </div>
                </div>
                <Box>
                    <div className="dropdown ms-auto">
                        <button
                            className=""
                            type="button"
                            id="lang-dropdown"
                            onClick={handleClick}
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <span style={{color: '#595959'}}>{lang} </span>
                            <KeyboardArrowDown
                                sx={{
                                    fill: '#595959',
                                }}
                            />
                            <span id="lang_text2">{$translate(anchorEl || 'Eng')}</span>
                        </button>

                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={openLang}
                            onClose={() => handleClose(lang)}
                            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                        >
                            <MenuItem id="english2" onClick={() => handleClose('Eng')}>
                                Eng
                            </MenuItem>
                            <MenuItem id="tamil2" onClick={() => handleClose('தமிழ்')}>
                                தமிழ்
                            </MenuItem>
                            <MenuItem id="telgu2" onClick={() => handleClose('తెలుగు')}>
                                తెలుగు
                            </MenuItem>
                            <MenuItem id="hindi2" onClick={() => handleClose('हिन्दी')}>
                                हिन्दी
                            </MenuItem>
                            <MenuItem id="malayalam2" onClick={() => handleClose('മലയാളം')}>
                            മലയാളം
                            </MenuItem>
                        </Menu>
                    </div>
                </Box>
            </Box>
        </Box>
    );
};
