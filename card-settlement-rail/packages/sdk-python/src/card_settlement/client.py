from __future__ import annotations
import json
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

class CardSettlementError(RuntimeError):
    def __init__(self,status:int,body:Any)->None:self.status=status;self.body=body;super().__init__(f'Card Settlement API request failed ({status})')
@dataclass(slots=True)
class CardSettlementClient:
    base_url: str
    api_key: str | None = None
    timeout: float = 15.0
    def _request(self,path:str,method:str='GET',body:dict[str,Any]|None=None)->Any:
        headers={'Accept':'application/json'}
        if self.api_key: headers['Authorization']=f'Bearer {self.api_key}'
        data=json.dumps(body).encode() if body is not None else None
        if data: headers['Content-Type']='application/json'
        req=Request(self.base_url.rstrip('/')+path,data=data,headers=headers,method=method)
        try:
            with urlopen(req,timeout=self.timeout) as response:
                raw=response.read().decode(); return json.loads(raw) if raw else None
        except HTTPError as exc:
            raw=exc.read().decode();
            try: parsed=json.loads(raw)
            except json.JSONDecodeError: parsed=raw
            raise CardSettlementError(exc.code,parsed) from exc
        except URLError as exc: raise CardSettlementError(0,str(exc.reason)) from exc
    def payout(self,merchant_id:str,amount:str,currency:str,destination:str,metadata:dict[str,Any]|None=None)->Any:
        return self._request('/payout','POST',{'merchant_id':merchant_id,'amount':amount,'currency':currency,'destination':destination,'metadata':metadata} if metadata else {'merchant_id':merchant_id,'amount':amount,'currency':currency,'destination':destination})
    def chargeback(self,transaction_id:str,amount:str,currency:str,reason_code:str,evidence:dict[str,Any]|None=None)->Any:
        return self._request('/chargeback','POST',{'transaction_id':transaction_id,'amount':amount,'currency':currency,'reason_code':reason_code,'evidence':evidence})
    def reconcile(self,date:str)->Any:
        if len(date)!=10: raise ValueError('date must be YYYY-MM-DD')
        return self._request(f'/reconcile/{date}')
