"""Streamlit dashboard for visualizing traffic state and emissions."""

import streamlit as st

from dashboard.components.traffic_status import render_traffic_status
from dashboard.components.emission_stats import render_emission_stats
from dashboard.components.signal_display import render_signal_display


def main():
    st.set_page_config(page_title="Smart Traffic AI", layout="wide")

    st.title("Smart Traffic AI Dashboard")

    st.sidebar.header("Controls")
    st.sidebar.write("(Placeholder) Adjust simulation parameters here")

    st.markdown("## Traffic Overview")
    render_traffic_status()

    st.markdown("## Emission Estimates")
    render_emission_stats()

    st.markdown("## Signal Plan")
    render_signal_display()


if __name__ == "__main__":
    main()
