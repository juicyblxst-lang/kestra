import * as React from 'react';import {clsx} from 'clsx';
export function Delta({value,format=n=>`${n>0?'+':''}${n}`,label}:{value:number;format?:(n:number)=>string;label?:string}){return <span aria-label={label} className={clsx('font-mono text-sm font-medium',value>0?'text-success-700':value<0?'text-danger-700':'text-finance-500')}>{value>0?'↑':value<0?'↓':'→'} {format(value)}</span>}
