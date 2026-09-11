package cardsettlement

import("bytes";"context";"encoding/json";"fmt";"io";"net/http";"strings")
type Client struct{BaseURL string; APIKey string; HTTPClient *http.Client}
type PayoutRequest struct{MerchantID string `json:"merchant_id"`; Amount string `json:"amount"`; Currency string `json:"currency"`; Destination string `json:"destination"`; Metadata map[string]any `json:"metadata,omitempty"`}
type APIError struct{Status int; Body any}
func(e *APIError)Error()string{return fmt.Sprintf("card settlement API request failed (%d)",e.Status)}
func(c *Client) do(ctx context.Context,method,path string,in any,out any)error{data:=[]byte(nil);if in!=nil{var err error;data,err=json.Marshal(in);if err!=nil{return err}};req,err:=http.NewRequestWithContext(ctx,method,strings.TrimRight(c.BaseURL,"/")+path,bytes.NewReader(data));if err!=nil{return err};req.Header.Set("Accept","application/json");if in!=nil{req.Header.Set("Content-Type","application/json")};if c.APIKey!=""{req.Header.Set("Authorization","Bearer "+c.APIKey)};hc:=c.HTTPClient;if hc==nil{hc=http.DefaultClient};res,err:=hc.Do(req);if err!=nil{return err};defer res.Body.Close();raw,err:=io.ReadAll(res.Body);if err!=nil{return err};if res.StatusCode<200||res.StatusCode>=300{var b any;_ = json.Unmarshal(raw,&b);return &APIError{res.StatusCode,b}};if out!=nil&&len(raw)>0{return json.Unmarshal(raw,out)};return nil}
func(c *Client)Payout(ctx context.Context,in PayoutRequest,out any)error{return c.do(ctx,http.MethodPost,"/payout",in,out)}
func(c *Client)Reconcile(ctx context.Context,date string,out any)error{if len(date)!=10{return fmt.Errorf("date must be YYYY-MM-DD")};return c.do(ctx,http.MethodGet,"/reconcile/"+date,nil,out)}
