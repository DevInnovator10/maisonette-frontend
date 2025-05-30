import { pillarPageGSSP } from './index';
import { storeWrapper } from '../../store';

const withPillarPageServerSideProps = ({ type = false }) =>
    storeWrapper.getServerSideProps(

    async (ctx) => pillarPageGSSP(ctx, type)
  );

export default withPillarPageServerSideProps;
