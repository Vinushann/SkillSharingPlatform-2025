import { Typography, Link } from '@mui/material';

function FooterColumn({ title, links }) {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                this is footer for the time being!
                {/*{title}*/}
            </Typography>
            {/*{links.map((link, index) => (*/}
            {/*    <Link key={index} href="#" color="inherit" underline="hover" display="block">*/}
            {/*        {link}*/}
            {/*    </Link>*/}
            {/*))}*/}
        </>
    );
}

export default FooterColumn;