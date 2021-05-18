import React from 'react';
import { Nav , NavItem ,Card} from 'reactstrap';

const FooterComponent = () => {
  return (
    <footer>
      <Card style={{marginTop:'10px'}}> 
        <Nav justified>
          <NavItem
           style={{color:'black'}}>
            To&nbsp;Everywhere,&nbsp;&nbsp;From&nbsp;Anywhere&nbsp;&nbsp;At&nbsp;PackNTag,&nbsp;&nbsp;We&nbsp;connect&nbsp;Karma & Deliver Happiness!
          </NavItem>
        </Nav>
        <div className="text-center small copyright">
           Copyright © Packntag 2018, All Rights Reserved
        </div>
      </Card>
    </footer>
  );
}
export default FooterComponent;