import {useContext,useCallback}  from "react"   
import {jobContext} from '../job.context'
import {getJobs} from '../services/job.api'

export const useJob = () => {
    const context = useContext(jobContext)
    if (!context) {
        throw new Error('job context must be used within an jobProvider');
    }
    const {
        job,
        setJob,
        loading,
        setLoading,
        jobCache,
        setJobCache,
        jobCacheRef,
        lastPageReached,
        setLastPageReached,
    } = context

    const activateCachedPage = useCallback((page = 1) => {
        const normalizedPage = Math.max(Number(page) || 1, 1)
        const cachedJobs = jobCacheRef.current[normalizedPage] ?? []
        setJob(cachedJobs)
        return cachedJobs
    }, [jobCacheRef, setJob])

    const handleGetJobs = useCallback(async (page = 1, options = {}) => {
        const { activate = true } = options
        const normalizedPage = Math.max(Number(page) || 1, 1)
        const cachedJobs = jobCacheRef.current[normalizedPage]

        if (cachedJobs !== undefined) {
            if (activate) {
                setJob(cachedJobs)
            }

            return { jobs: cachedJobs, page: normalizedPage, cached: true }
        }

        setLoading(true)
        try {
            const data = await getJobs(normalizedPage)
            const jobs = Array.isArray(data?.jobs) ? data.jobs : []

            setJobCache((prev) => ({
                ...prev,
                [normalizedPage]: jobs,
            }))

            if (activate) {
                setJob(jobs)
            }

            if (jobs.length === 0) {
                setLastPageReached((prev) => prev ?? Math.max(normalizedPage - 1, 0))
            }

            return { jobs, page: normalizedPage, cached: false }
        } catch (err) {
            console.error('handleGetJobs failed', err)
            // rethrow so caller can react (e.g. show message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [jobCacheRef, setJob, setJobCache, setLastPageReached, setLoading])

    return {loading,job,jobCache,lastPageReached,activateCachedPage,handleGetJobs}
}